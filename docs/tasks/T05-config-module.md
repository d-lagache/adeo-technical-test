# T05 — Configuration et validation de l'environnement

**Phase :** 1 — Backend : socle et base de données  
**Dépend de :** [T04](./T04-scaffold-nestjs.md)  
**Références :** docs/architecture.md §5.1, §9

## Objectif

Charger `.env` et refuser de démarrer si la configuration est invalide.

## Fichiers concernés

- `backend/src/config/env.validation.ts` (+ `env.validation.spec.ts`)
- `backend/src/main.ts` (port lu via `ConfigService`)
- `backend/vitest.config.ts` (`setupFiles: ['reflect-metadata']`)
- `backend/src/app.module.ts`
- `backend/.env.example`

## Étapes

1. Installer `@nestjs/config` (et `class-validator` / `class-transformer` pour décrire le schéma).
2. Déclarer `ConfigModule.forRoot({ isGlobal: true, validate })`.
3. Valider `DATABASE_URL` (requis), `PORT` (entier, défaut 3000), `CORS_ORIGIN` (défaut `http://localhost:5173`).
4. Créer `.env.example` cohérent avec `docker-compose.yml`.

## Fait quand

- [x] Sans `DATABASE_URL`, l'API s'arrête avec un message explicite.
- [x] Avec `cp .env.example .env`, l'API démarre.
