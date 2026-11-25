# T27 — Bandeau KPI

**Phase :** 3 — Frontend (bonus)  
**Dépend de :** [T14](./T14-stats-endpoint.md), [T24](./T24-primevue.md), [T25](./T25-vue-query.md), [T26](./T26-api-client.md)  
**Références :** docs/architecture.md §8.2, README.md Phase 3 §1

## Objectif

Afficher nombre total de produits et d'avis en haut de page.

## Fichiers concernés

- `frontend/src/composables/useStats.ts`
- `frontend/src/components/KpiBar.vue`
- `frontend/src/components/__tests__/KpiBar.spec.ts` (dossier `__tests__` imposé par les `tsconfig` du scaffold)

## Étapes

1. `useStats()` = `useQuery({ queryKey: ['stats'], queryFn })`.
2. `KpiBar` : deux `Card`, `Skeleton` pendant le chargement, `Message` en cas d'erreur.
3. Test : rendu des deux valeurs, skeletons et message d'erreur (composable mocké).

## Fait quand

- [x] Le bandeau affiche 250 et 766.
- [x] API coupée → message d'erreur, le reste de la page fonctionne.
