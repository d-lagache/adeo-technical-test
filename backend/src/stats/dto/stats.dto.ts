/** Indicateurs globaux du catalogue (bandeau KPI du dashboard). */
export class StatsDto {
  /**
   * Nombre total de produits du catalogue.
   * @example 250
   */
  totalProducts: number;

  /**
   * Nombre total d'avis, tous produits confondus.
   * @example 766
   */
  totalReviews: number;
}
