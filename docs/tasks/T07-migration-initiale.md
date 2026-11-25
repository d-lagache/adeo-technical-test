# T07 — Migration initiale et contraintes CHECK

**Phase :** 1 — Backend : socle et base de données  
**Dépend de :** [T03](./T03-docker-compose.md), [T06](./T06-prisma-schema.md)  
**Références :** docs/database-schema.md §2–4, docs/architecture.md §4.3

## Objectif

Créer les tables en base, avec les contraintes que Prisma ne sait pas exprimer.

## Fichiers concernés

- `backend/prisma/migrations/<timestamp>_init/migration.sql`

## Étapes

1. `npx prisma migrate dev --name init --create-only`.
2. Ajouter à la main en fin de fichier : `CHECK (price >= 0)`, `CHECK (stock >= 0)`, `CHECK (notation BETWEEN 1 AND 5)`.
3. Vérifier que les id sont en `GENERATED ALWAYS AS IDENTITY` ; sinon, adapter le SQL et le documenter.
4. `npx prisma migrate dev` pour appliquer.

## Fait quand

- [x] `\d products` et `\d reviews` dans psql montrent les 3 `CHECK`, les FK et les index.
- [x] Un `INSERT` avec `notation = 6` est rejeté.
