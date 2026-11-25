# T28 — Section « Produits les plus appréciés »

**Phase :** 3 — Frontend (bonus)  
**Dépend de :** [T17](./T17-most-appreciated.md), [T24](./T24-primevue.md), [T25](./T25-vue-query.md), [T26](./T26-api-client.md)  
**Références :** docs/architecture.md §8.2, README.md Phase 3 §2

## Objectif

Afficher les 5 produits ayant le plus d'avis positifs.

## Fichiers concernés

- `frontend/src/composables/useMostAppreciated.ts`
- `frontend/src/components/ProductCards.vue`
- `frontend/src/components/ProductCards.spec.ts`

## Étapes

1. `useMostAppreciated()` appelle `/products/most-appreciated?limit=5`.
2. `ProductCards` réutilisable : props `title`, `products`, `loading`, `error`, slot ou prop pour la métrique mise en avant.
3. Afficher `positiveReviewsCount`.
4. Test : rendu de N cartes.

## Fait quand

- [ ] 5 cartes affichées, triées par nombre d'avis positifs.
