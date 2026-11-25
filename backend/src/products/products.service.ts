import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
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

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Catalogue complet en version résumée. Les agrégats sont calculés en SQL ;
   * le `LEFT JOIN` conserve les produits sans avis (0 avis, moyenne `null`).
   */
  async findAll(): Promise<ProductSummaryDto[]> {
    const rows = await this.prisma.$queryRaw<ProductSummaryRow[]>`
      SELECT p.reference,
             p.name,
             p.price,
             p.currency,
             p.stock,
             COUNT(r.id)::int  AS "reviewsCount",
             AVG(r.notation)   AS "averageNotation"
        FROM products p
        LEFT JOIN reviews r ON r.product_id = p.id
       GROUP BY p.id
       ORDER BY p.reference`;
    return rows.map(toProductSummaryDto);
  }
}
