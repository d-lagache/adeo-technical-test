import type {
  SourceAuthor,
  SourceAuthorType,
  SourceProduct,
} from './source.types.js';

export interface ProductRow {
  reference: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
}

export interface AuthorRow {
  firstName: string;
  lastName: string;
  type: SourceAuthorType;
}

/** Avis à insérer : produit et auteur désignés par leurs clés naturelles, résolues en id à l'insertion. */
export interface ReviewRow {
  productReference: string;
  authorKey: string;
  notation: number;
  comment: string;
  reviewedAt: Date;
}

export interface SeedData {
  products: ProductRow[];
  authors: AuthorRow[];
  reviews: ReviewRow[];
}

/**
 * Clé d'identité d'un auteur : la source n'a pas d'identifiant, on dédoublonne
 * sur `(firstName, lastName, type)`, comme la contrainte `authors_identity_key`.
 * `JSON.stringify` évite toute collision liée à un séparateur.
 */
export function authorKey(author: AuthorRow | SourceAuthor): string {
  return JSON.stringify([author.firstName, author.lastName, author.type]);
}

/**
 * La date source n'a pas de fuseau et la colonne `reviewed_at` est un `TIMESTAMP`
 * sans fuseau : on la lit en UTC pour que Prisma écrive exactement la même valeur,
 * quel que soit le fuseau de la machine qui lance l'API.
 */
export function parseSourceDate(date: string): Date {
  const parsed = new Date(`${date}Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Date d'avis invalide dans la source : "${date}"`);
  }
  return parsed;
}

/** Transforme le catalogue source en lignes prêtes à insérer (fonction pure). */
export function mapSourceToSeedData(source: SourceProduct[]): SeedData {
  const products: ProductRow[] = [];
  const authors = new Map<string, AuthorRow>();
  const reviews: ReviewRow[] = [];

  for (const product of source) {
    products.push({
      reference: product.reference,
      name: product.name,
      description: product.description,
      price: product.price,
      currency: product.currency,
      stock: product.stock,
    });

    for (const review of product.reviews) {
      const { firstName, lastName, type } = review.author;
      const key = authorKey(review.author);
      if (!authors.has(key)) {
        authors.set(key, { firstName, lastName, type });
      }

      reviews.push({
        productReference: product.reference,
        authorKey: key,
        notation: review.notation,
        comment: review.comment,
        reviewedAt: parseSourceDate(review.date),
      });
    }
  }

  return { products, authors: [...authors.values()], reviews };
}
