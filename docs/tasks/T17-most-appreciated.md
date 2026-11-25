# T17 — Endpoint GET /products/most-appreciated

**Phase :** 2 — Backend : API  
**Dépend de :** [T15](./T15-products-list.md), [T16](./T16-limit-query-dto.md)  
**Références :** docs/architecture.md §6, README.md Phase 3 §2

## Objectif

Les N produits ayant le plus d'avis positifs (`notation > 3`).

## Fichiers concernés

- `backend/src/products/products.controller.ts`
- `backend/src/products/products.service.ts`
- `backend/src/products/dto/most-appreciated-product.dto.ts`
- `backend/src/products/products.service.spec.ts`

## Étapes

1. DTO = `ProductSummaryDto` + `positiveReviewsCount`.
2. Requête SQL : comptage filtré `notation > 3`, `ORDER BY positive_count DESC, reference`, `LIMIT`.
3. Route déclarée **avant** `@Get(':reference')`.
4. Test : un avis noté 3 n'est pas compté comme positif.

## Fait quand

- [x] `curl '.../products/most-appreciated?limit=5' | jq length` → 5, triés par `positiveReviewsCount` décroissant.
- [x] `limit=0` → 400.
