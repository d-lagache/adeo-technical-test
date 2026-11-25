import { ProductSummaryDto } from './product-summary.dto.js';

/** Produit résumé enrichi du nombre d'avis positifs (classement « plus appréciés »). */
export class MostAppreciatedProductDto extends ProductSummaryDto {
  /**
   * Nombre d'avis positifs, c'est-à-dire de note strictement supérieure à 3.
   * @example 2
   */
  positiveReviewsCount: number;
}
