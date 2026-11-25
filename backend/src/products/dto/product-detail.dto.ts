import { ProductSummaryDto } from './product-summary.dto.js';

/** Détail d'un produit : résumé + description. Les avis sont une sous-ressource à part. */
export class ProductDetailDto extends ProductSummaryDto {
  /** Description complète du produit. */
  description: string;
}
