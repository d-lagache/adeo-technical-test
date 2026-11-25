import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PrismaService } from '../prisma/prisma.service.js';
import { authorKey, mapSourceToSeedData } from './seed.mapper.js';
import type { SourceProduct } from './source.types.js';

/**
 * `data/products.json`, résolu depuis la racine du dépôt. Même profondeur depuis
 * `src/seed/` (ts, Vitest) et `dist/seed/` (build) : backend/{src,dist}/seed → racine.
 */
export const SOURCE_FILE = resolve(
  import.meta.dirname,
  '../../../data/products.json',
);

/** Remplit la base au démarrage si elle est vide (voir docs/architecture.md §7). */
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap(): Promise<void> {
    // Idempotent : une base déjà remplie n'est jamais modifiée.
    const existing = await this.prisma.product.count();
    if (existing > 0) {
      this.logger.log(`Base déjà remplie (${existing} produits) : seed ignoré`);
      return;
    }

    const source = JSON.parse(
      await readFile(SOURCE_FILE, 'utf8'),
    ) as SourceProduct[];
    const data = mapSourceToSeedData(source);

    // Atomique : une erreur annule tout, la base reste vide.
    const counts = await this.prisma.$transaction(
      async (tx) => {
        const authors = await tx.author.createManyAndReturn({
          data: data.authors,
          select: { id: true, firstName: true, lastName: true, type: true },
        });
        const products = await tx.product.createManyAndReturn({
          data: data.products,
          select: { id: true, reference: true },
        });

        const authorIds = new Map(authors.map((a) => [authorKey(a), a.id]));
        const productIds = new Map(products.map((p) => [p.reference, p.id]));

        const reviews = await tx.review.createMany({
          data: data.reviews.map((review) => ({
            productId: lookup(productIds, review.productReference, 'produit'),
            authorId: lookup(authorIds, review.authorKey, 'auteur'),
            notation: review.notation,
            comment: review.comment,
            reviewedAt: review.reviewedAt,
          })),
        });

        return {
          products: products.length,
          authors: authors.length,
          reviews: reviews.count,
        };
      },
      { timeout: 30_000 },
    );

    this.logger.log(
      `Seed terminé : ${counts.products} produits, ${counts.reviews} avis, ${counts.authors} auteurs insérés`,
    );
  }
}

function lookup(ids: Map<string, number>, key: string, label: string): number {
  const id = ids.get(key);
  if (id === undefined) {
    throw new Error(`Seed : ${label} introuvable pour la clé ${key}`);
  }
  return id;
}
