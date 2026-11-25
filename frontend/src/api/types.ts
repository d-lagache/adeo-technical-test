// Types des réponses de l'API, alignés sur les DTO de sortie du backend
// (backend/src/stats/dto, backend/src/products/dto).

/** Indicateurs globaux du catalogue (`GET /stats`). */
export interface Stats {
  totalProducts: number
  totalReviews: number
}

/** Produit en version résumée (`GET /products`, `GET /products/lowest-rated`). */
export interface ProductSummary {
  reference: string
  name: string
  price: number
  /** Code devise ISO 4217. */
  currency: string
  stock: number
  reviewsCount: number
  /** Note moyenne (1 à 5) arrondie à 2 décimales ; `null` si aucun avis. */
  averageNotation: number | null
}

/** Produit résumé enrichi du nombre d'avis positifs (`GET /products/most-appreciated`). */
export interface MostAppreciatedProduct extends ProductSummary {
  /** Nombre d'avis de note strictement supérieure à 3. */
  positiveReviewsCount: number
}

/** Détail d'un produit : résumé + description (`GET /products/:reference`). */
export interface ProductDetail extends ProductSummary {
  description: string
}

/** Profil de l'auteur d'un avis. */
export type AuthorType = 'professional' | 'amateur'

/** Auteur d'un avis (aucun identifiant exposé). */
export interface Author {
  firstName: string
  lastName: string
  type: AuthorType
}

/** Avis client, auteur inclus (`GET /products/:reference/reviews`), du plus récent au plus ancien. */
export interface Review {
  /** Note de 1 à 5. */
  notation: number
  comment: string
  /** Date et heure ISO 8601 sans fuseau (`2025-04-06T02:09:10`), à lire en heure locale. */
  date: string
  author: Author
}
