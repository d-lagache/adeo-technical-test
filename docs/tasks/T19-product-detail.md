# T19 — Endpoint GET /products/:reference

**Phase :** 2 — Backend : API  
**Dépend de :** [T15](./T15-products-list.md)  
**Références :** docs/architecture.md §6

## Objectif

Détail d'un produit, sans ses avis.

## Fichiers concernés

- `backend/src/products/products.controller.ts`
- `backend/src/products/products.service.ts`
- `backend/src/products/dto/product-detail.dto.ts`
- `backend/src/products/products.service.spec.ts`

## Étapes

1. `ProductDetailDto extends ProductSummaryDto` + `description`.
2. `NotFoundException` si la référence est inconnue.
3. Test : 404 sur référence inconnue.

## Fait quand

- [ ] `curl .../products/59033201` → 200 avec `description`.
- [ ] `curl .../products/inconnu` → 404 `{ statusCode, message, error }`.
