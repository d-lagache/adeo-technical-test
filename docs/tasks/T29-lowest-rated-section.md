# T29 — Section « Produits les moins bien notés »

**Phase :** 3 — Frontend (bonus)  
**Dépend de :** [T18](./T18-lowest-rated.md), [T28](./T28-most-appreciated-section.md)  
**Références :** docs/architecture.md §8.2, README.md Phase 3 §3

## Objectif

Afficher les 5 produits avec la moyenne la plus basse (< 3).

## Fichiers concernés

- `frontend/src/composables/useLowestRated.ts`

## Étapes

1. `useLowestRated()` appelle `/products/lowest-rated?limit=5`.
2. Réutiliser `ProductCards`, en mettant en avant `averageNotation` (ex. composant `Rating` en lecture seule).

## Fait quand

- [ ] Jusqu'à 5 cartes avec moyenne < 3, ordre croissant.
