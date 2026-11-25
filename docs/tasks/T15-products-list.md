# T15 — Endpoint GET /products

**Phase :** 2 — Backend : API  
**Dépend de :** [T11](./T11-seed-service.md), [T13](./T13-swagger-setup.md)  
**Références :** docs/architecture.md §6

## Objectif

Exposer le catalogue complet en version résumée, agrégats calculés en SQL.

## Fichiers concernés

- `backend/src/products/products.module.ts`
- `backend/src/products/products.controller.ts`
- `backend/src/products/products.service.ts`
- `backend/src/products/dto/product-summary.dto.ts`
- `backend/src/products/products.service.spec.ts`

## Étapes

1. `ProductSummaryDto` : `reference`, `name`, `price` (number), `currency`, `stock`, `reviewsCount`, `averageNotation` (number | null).
2. Requête : `review.groupBy({ by: ['productId'], _count, _avg })` ou `$queryRaw` avec `LEFT JOIN` + `GROUP BY` (les produits sans avis doivent apparaître).
3. Conversion `Decimal` → number et arrondi de la moyenne (2 décimales) dans le mapping DTO.
4. Tri par défaut stable (ex. `reference`).
5. Test : mapping d'un produit sans avis (`reviewsCount: 0`, `averageNotation: null`).

## Fait quand

- [x] `curl .../products | jq length` → 250.
- [x] Aucun champ `id` dans la réponse.
