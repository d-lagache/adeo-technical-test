# T12 — Configuration transverse de l'API

**Phase :** 2 — Backend : API  
**Dépend de :** [T05](./T05-config-module.md)  
**Références :** docs/architecture.md §5.3

## Objectif

Mettre en place préfixe, validation et CORS pour toutes les routes.

## Fichiers concernés

- `backend/src/main.ts`

## Étapes

1. `app.setGlobalPrefix('api/v1')`.
2. `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))` ; installer `class-validator` et `class-transformer`.
3. `app.enableCors({ origin: CORS_ORIGIN })`.
4. Écouter sur `PORT` via `ConfigService`.

## Fait quand

- [ ] `curl localhost:3000/api/v1/inconnu` → 404 au format Nest.
- [ ] Requête depuis `http://localhost:5173` acceptée (en-tête `Access-Control-Allow-Origin`).
