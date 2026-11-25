# T35 — Bandeau KPI lisible

**Phase :** 3bis — Refonte UI  
**Dépend de :** [T27](./T27-kpi-bar.md), [T34](./T34-adeo-theme.md)  
**Références :** docs/architecture.md §8.2

## Objectif

Rendre le bandeau KPI lisible d'un coup d'œil. Il garde les 2 indicateurs existants et le backend ne change pas.

## Fichiers concernés

- `frontend/src/components/KpiBar.vue`
- `frontend/src/components/__tests__/KpiBar.spec.ts`

## Étapes

1. Afficher 2 `Card` côte à côte (elles passent à la ligne sur écran étroit).
2. Chaque carte contient une icône primeicons (`pi-box`, `pi-comments`) en couleur primaire, un grand chiffre formaté `fr-FR` (`1 234`) et un libellé explicite (« Produits au catalogue », « Avis clients »).
3. Garder le skeleton pendant le chargement, le message d'erreur et les `data-testid`.
4. Mettre à jour le test : valeurs formatées et libellés.

## Fait quand

- [ ] Le bandeau affiche 250 produits et 766 avis, lisibles avec leur libellé.
