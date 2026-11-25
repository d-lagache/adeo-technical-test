# T21 — Passe de finition Swagger

**Phase :** 2 — Backend : API  
**Dépend de :** [T14](./T14-stats-endpoint.md), [T17](./T17-most-appreciated.md), [T18](./T18-lowest-rated.md), [T20](./T20-product-reviews.md)  
**Références :** README.md Phase 2 (Documentation)

## Objectif

Rendre la documentation suffisante pour consommer l'API sans lire le code.

## Fichiers concernés

- `backend/src/**/*.controller.ts`
- `backend/src/**/dto/*.ts`

## Étapes

1. `@ApiOperation({ summary, description })` sur chaque route (préciser `notation > 3`, moyenne `< 3`).
2. `@ApiParam` pour `reference` avec exemple `59033201`.
3. `@ApiNotFoundResponse` / `@ApiBadRequestResponse` là où c'est pertinent.
4. Exemples dans les `@ApiProperty` des DTO.

## Fait quand

- [x] Chaque route de Swagger UI a un résumé, un schéma de réponse et ses codes d'erreur.
- [x] « Try it out » fonctionne sur chaque route.
