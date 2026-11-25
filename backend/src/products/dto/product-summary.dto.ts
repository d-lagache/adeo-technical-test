/** Produit en version résumée (liste et classements), sans description ni avis. */
export class ProductSummaryDto {
  /**
   * Référence du produit, identifiant public.
   * @example 59033201
   */
  reference: string;

  /**
   * Nom du produit.
   * @example "Non dolor minim ex veniam ipsum qui eiusmod velit est cupidatat in proident ipsum aliquip non labore"
   */
  name: string;

  /**
   * Prix unitaire.
   * @example 972.5
   */
  price: number;

  /**
   * Code devise ISO 4217.
   * @example EUR
   */
  currency: string;

  /**
   * Quantité en stock.
   * @example 415
   */
  stock: number;

  /**
   * Nombre d'avis reçus.
   * @example 3
   */
  reviewsCount: number;

  /**
   * Note moyenne des avis (1 à 5), arrondie à 2 décimales ; `null` si aucun avis.
   * @example 4.33
   */
  averageNotation: number | null;
}
