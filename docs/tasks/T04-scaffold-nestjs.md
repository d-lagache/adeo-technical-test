# T04 — Scaffolder l'application NestJS

**Phase :** 1 — Backend : socle et base de données  
**Dépend de :** [T02](./T02-nvmrc.md)  
**Références :** docs/architecture.md §3, §10

## Objectif

Créer le squelette de l'API dans `backend/`.

## Fichiers concernés

- `backend/package.json`
- `backend/src/main.ts`
- `backend/src/app.module.ts`
- `backend/tsconfig.json`

## Étapes

1. `npx @nestjs/cli@12.0 new backend --package-manager npm --strict --skip-git`.
2. Supprimer `app.controller.ts`, `app.service.ts` et leurs specs ; nettoyer `AppModule`.
3. Supprimer le dossier `test/` e2e et sa config Vitest (tests unitaires uniquement).
4. Retirer `@nestjs/observe` et `@nestjs/mau` ajoutés par le CLI ; aligner les dépendances sur les dernières versions stables.

> Le CLI NestJS 12 génère un projet ESM avec Vitest et oxlint (et non Jest/ESLint) : choix conservé, voir architecture.md §2.

## Fait quand

- [x] `npm run start:dev` démarre sans erreur.
- [x] `npm run lint` et `npm run build` passent.
