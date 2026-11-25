# T08 — PrismaModule et PrismaService

**Phase :** 1 — Backend : socle et base de données  
**Dépend de :** [T07](./T07-migration-initiale.md)  
**Références :** docs/architecture.md §5.1

## Objectif

Fournir un client Prisma unique, injectable partout.

## Fichiers concernés

- `backend/src/prisma/prisma.service.ts`
- `backend/src/prisma/prisma.module.ts`

## Étapes

1. `PrismaService extends PrismaClient` avec `onModuleInit` (`$connect`) et `onModuleDestroy` (`$disconnect`).
2. `PrismaModule` `@Global()` qui exporte le service ; l'importer dans `AppModule`.

## Fait quand

- [ ] L'API démarre et se connecte à la base (log Nest sans erreur).
- [ ] Base arrêtée → l'API échoue au démarrage avec une erreur lisible.
