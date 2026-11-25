import { ProductSummaryDto } from './product-summary.dto.js';

/** Détail d'un produit : résumé + description. Les avis sont une sous-ressource à part. */
export class ProductDetailDto extends ProductSummaryDto {
  /**
   * Description complète du produit.
   * @example "Labore est dolor sed laborum id irure ullamco commodo voluptate proident in elit anim Duis tempor dolore."
   */
  description: string;
}
