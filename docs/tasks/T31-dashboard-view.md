# T31 — Assemblage du dashboard

**Phase :** 3 — Frontend (bonus)  
**Dépend de :** [T27](./T27-kpi-bar.md), [T28](./T28-most-appreciated-section.md), [T29](./T29-lowest-rated-section.md), [T30](./T30-catalogue-table.md)  
**Références :** docs/architecture.md §8.2

## Objectif

Composer la page à partir des 4 sections.

## Fichiers concernés

- `frontend/src/views/DashboardView.vue`
- `frontend/src/App.vue`

## Étapes

1. `DashboardView` : KPI en haut, puis les deux classements, puis le catalogue.
2. `App.vue` affiche `DashboardView`.
3. Vérifier : uniquement `<script setup lang="ts">`, aucune Options API.

## Fait quand

- [ ] `npm run dev` affiche le dashboard complet.
- [ ] `grep -rE "data\(\)|methods:" frontend/src` ne renvoie rien.
