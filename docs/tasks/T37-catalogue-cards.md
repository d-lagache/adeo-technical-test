# T37 — Catalogue en cartes

**Phase :** 3bis — Refonte UI  
**Dépend de :** [T30](./T30-catalogue-table.md), [T36](./T36-product-card.md)  
**Références :** docs/architecture.md §3, §8.2

## Objectif

Afficher le catalogue complet avec les mêmes cartes que les classements, au lieu du `DataTable`.

## Fichiers concernés

- `frontend/src/components/CatalogueSection.vue` (nouveau)
- `frontend/src/components/ProductTable.vue` et `__tests__/ProductTable.spec.ts` (supprimés)
- `frontend/src/views/DashboardView.vue`, `views/__tests__/DashboardView.spec.ts`
- `docs/architecture.md`

## Étapes

1. `CatalogueSection` : branche `useProducts()` sur `ProductCards` (« Catalogue complet »). Les 250 cartes s'affichent d'un coup, sans pagination (choix assumé).
2. `DashboardView` : remplacer `ProductTable` par `CatalogueSection`, puis supprimer `ProductTable` et son test.
3. Mettre à jour le test de `DashboardView` et la doc (§3 arborescence, §8.2 tableau des sections).

## Fait quand

- [ ] Le catalogue affiche 250 cartes identiques à celles des classements.
