# T30 — Catalogue complet

**Phase :** 3 — Frontend (bonus)  
**Dépend de :** [T15](./T15-products-list.md), [T24](./T24-primevue.md), [T25](./T25-vue-query.md), [T26](./T26-api-client.md)  
**Références :** docs/architecture.md §8.2, README.md Phase 3 §4

## Objectif

Lister tous les produits, sans filtre ni pagination.

## Fichiers concernés

- `frontend/src/composables/useProducts.ts`
- `frontend/src/components/ProductTable.vue`

## Étapes

1. `useProducts()` appelle `/products`.
2. `DataTable` sans pagination : référence, nom, prix (formaté avec `currency`), stock, nombre d'avis, moyenne.
3. États loading (prop `loading` du DataTable) et erreur.

## Fait quand

- [ ] Les 250 produits sont listés.
