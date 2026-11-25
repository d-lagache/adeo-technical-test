/** Produit en version résumée (liste et classements), sans description ni avis. */
export class ProductSummaryDto {
  /** Référence du produit, identifiant public. */
  reference: string;

  /** Nom du produit. */
  name: string;

  /** Prix unitaire. */
  price: number;

  /** Code devise ISO 4217. */
  currency: string;

  /** Quantité en stock. */
  stock: number;

  /** Nombre d'avis reçus. */
  reviewsCount: number;

  /** Note moyenne des avis (1 à 5), arrondie à 2 décimales ; `null` si aucun avis. */
  averageNotation: number | null;
}
