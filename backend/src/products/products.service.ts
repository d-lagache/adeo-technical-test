import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { MostAppreciatedProductDto } from './dto/most-appreciated-product.dto.js';
import { ProductSummaryDto } from './dto/product-summary.dto.js';

/** Ligne brute renvoyée par PostgreSQL (`numeric` arrive en `Decimal`, d'où `{ toString }`). */
export interface ProductSummaryRow {
  reference: string;
  name: string;
  price: number | string | { toString(): string };
  currency: string;
  stock: number;
  reviewsCount: number;
  averageNotation: number | string | { toString(): string } | null;
}

export interface MostAppreciatedRow extends ProductSummaryRow {
  positiveReviewsCount: number;
}

/** Convertit une ligne SQL en DTO : `Decimal` → number, moyenne arrondie à 2 décimales. */
export function toProductSummaryDto(row: ProductSummaryRow): ProductSummaryDto {
  return {
    reference: row.reference,
    name: row.name,
    price: Number(row.price),
    currency: row.currency,
    stock: row.stock,
    reviewsCount: row.reviewsCount,
    averageNotation:
      row.averageNotation === null
        ? null
        : Math.round(Number(row.averageNotation) * 100) / 100,
  };
}

export function toMostAppreciatedProductDto(
  row: MostAppreciatedRow,
): MostAppreciatedProductDto {
  return Object.assign(toProductSummaryDto(row), {
    positiveReviewsCount: row.positiveReviewsCount,
  });
}

/** Colonnes du résumé produit, agrégats compris (requiert l'alias `p` et `r`, et un `GROUP BY p.id`). */
const SUMMARY_COLUMNS = Prisma.sql`
  p.reference,
  p.name,
  p.price,
  p.currency,
  p.stock,
  COUNT(r.id)::int AS "reviewsCount",
  AVG(r.notation)  AS "averageNotation"`;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Catalogue complet en version résumée. Les agrégats sont calculés en SQL ;
   * le `LEFT JOIN` conserve les produits sans avis (0 avis, moyenne `null`).
   */
  async findAll(): Promise<ProductSummaryDto[]> {
    const rows = await this.prisma.$queryRaw<ProductSummaryRow[]>(Prisma.sql`
      SELECT ${SUMMARY_COLUMNS}
        FROM products p
        LEFT JOIN reviews r ON r.product_id = p.id
       GROUP BY p.id
       ORDER BY p.reference`);
    return rows.map(toProductSummaryDto);
  }

  /**
   * Les `limit` produits ayant le plus d'avis positifs (`notation > 3`, strict),
   * comptés en SQL avec un agrégat filtré ; départage par référence.
   */
  async findMostAppreciated(
    limit: number,
  ): Promise<MostAppreciatedProductDto[]> {
    const rows = await this.prisma.$queryRaw<MostAppreciatedRow[]>(Prisma.sql`
      SELECT ${SUMMARY_COLUMNS},
             COUNT(r.id) FILTER (WHERE r.notation > 3)::int AS "positiveReviewsCount"
        FROM products p
        LEFT JOIN reviews r ON r.product_id = p.id
       GROUP BY p.id
       ORDER BY "positiveReviewsCount" DESC, p.reference
       LIMIT ${limit}`);
    return rows.map(toMostAppreciatedProductDto);
  }
}
