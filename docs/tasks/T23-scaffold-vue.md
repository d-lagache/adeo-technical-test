# T23 — Scaffolder l'application Vue 3

**Phase :** 3 — Frontend (bonus)  
**Dépend de :** [T02](./T02-nvmrc.md)  
**Références :** docs/architecture.md §3, §8.1

## Objectif

Créer le squelette du dashboard dans `frontend/`.

## Fichiers concernés

- `frontend/package.json`
- `frontend/src/main.ts`
- `frontend/src/App.vue`
- `frontend/vite.config.ts`

## Étapes

1. `npm create vue@latest frontend` avec TypeScript, Vitest, ESLint, Prettier (sans router ni Pinia).
2. Supprimer les composants et assets d'exemple.

## Fait quand

- [x] `npm run dev` sert une page vide sur `http://localhost:5173`.
- [x] `npm run lint`, `npm run type-check` et `npx vitest run` passent.
