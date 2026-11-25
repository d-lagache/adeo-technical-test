# T18 — Endpoint GET /products/lowest-rated

**Phase :** 2 — Backend : API  
**Dépend de :** [T15](./T15-products-list.md), [T16](./T16-limit-query-dto.md)  
**Références :** docs/architecture.md §6, README.md Phase 3 §3

## Objectif

Les N produits dont la moyenne est strictement inférieure à 3.

## Fichiers concernés

- `backend/src/products/products.controller.ts`
- `backend/src/products/products.service.ts`
- `backend/src/products/products.service.spec.ts`

## Étapes

1. Requête SQL : `HAVING AVG(notation) < 3`, `ORDER BY AVG ASC, reference`, `LIMIT`.
2. Les produits sans avis sont exclus.
3. Route déclarée **avant** `@Get(':reference')`.
4. Test : un produit à moyenne exactement 3 est exclu.

## Fait quand

- [x] `curl '.../products/lowest-rated?limit=5'` → ≤ 5 produits, `averageNotation < 3`, ordre croissant.
