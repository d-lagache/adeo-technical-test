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

1. `npx @nestjs/cli new backend --package-manager npm --strict --skip-git`.
2. Supprimer `app.controller.ts`, `app.service.ts` et leurs specs ; nettoyer `AppModule`.
3. Supprimer le dossier `test/` e2e (tests unitaires uniquement).

## Fait quand

- [ ] `npm run start:dev` démarre sans erreur.
- [ ] `npm run lint` et `npm run build` passent.
