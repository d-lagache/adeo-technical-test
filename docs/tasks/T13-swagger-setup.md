# T13 — Swagger UI et OpenAPI

**Phase :** 2 — Backend : API  
**Dépend de :** [T12](./T12-main-bootstrap.md)  
**Références :** docs/architecture.md §5.3

## Objectif

Exposer une documentation générée à partir du code.

## Fichiers concernés

- `backend/src/main.ts`
- `backend/nest-cli.json`

## Étapes

1. Installer `@nestjs/swagger`.
2. `DocumentBuilder` : titre, description du catalogue, version `1.0`.
3. `SwaggerModule.setup('api/docs', app, document, { jsonDocumentUrl: 'api/docs-json' })`.
4. Activer le plugin CLI Swagger dans `nest-cli.json` (moins de décorateurs à écrire).

## Fait quand

- [x] `http://localhost:3000/api/docs` affiche Swagger UI.
- [x] `curl localhost:3000/api/docs-json` renvoie un document OpenAPI valide.
