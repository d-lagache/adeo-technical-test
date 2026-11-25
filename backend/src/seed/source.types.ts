/**
 * Forme des données de `data/products.json` (voir docs/database-schema.md §7).
 * Ces types décrivent le fichier source, indépendamment de Prisma : `SourceAuthorType`
 * reprend volontairement les valeurs de l'enum Prisma `AuthorType` sans en dépendre.
 */

export type SourceAuthorType = 'amateur' | 'professional';

export interface SourceAuthor {
  firstName: string;
  lastName: string;
  type: SourceAuthorType;
}

export interface SourceReview {
  notation: number;
  /** Date sans fuseau, ex. `2025-04-06T02:09:10`. */
  date: string;
  comment: string;
  author: SourceAuthor;
}

export interface SourceProduct {
  reference: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  reviews: SourceReview[];
}
