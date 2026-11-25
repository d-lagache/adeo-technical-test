# T20 — Endpoint GET /products/:reference/reviews

**Phase :** 2 — Backend : API  
**Dépend de :** [T19](./T19-product-detail.md)  
**Références :** docs/architecture.md §6

## Objectif

Avis d'un produit, auteur inclus, en sous-ressource.

## Fichiers concernés

- `backend/src/products/products.controller.ts`
- `backend/src/products/products.service.ts`
- `backend/src/products/dto/review.dto.ts`
- `backend/src/products/dto/author.dto.ts`
- `backend/src/products/products.service.spec.ts`

## Étapes

1. `ReviewDto { notation, comment, date, author: AuthorDto }`, `AuthorDto { firstName, lastName, type }`.
2. Requête avec `include: { author }`, tri par date décroissante.
3. 404 si le produit n'existe pas ; `[]` s'il existe sans avis.
4. Test : distinction 404 / tableau vide.

## Fait quand

- [x] `curl .../products/59033201/reviews` → avis avec auteur, aucun `id`.
- [x] Référence inconnue → 404.
