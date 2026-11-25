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
