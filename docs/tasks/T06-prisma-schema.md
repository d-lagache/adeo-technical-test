# T06 — Schéma Prisma

**Phase :** 1 — Backend : socle et base de données  
**Dépend de :** [T05](./T05-config-module.md)  
**Références :** docs/database-schema.md §2–5, §7

## Objectif

Traduire le modèle relationnel en `schema.prisma`.

## Fichiers concernés

- `backend/prisma/schema.prisma`
- `backend/package.json`

## Étapes

1. Installer `prisma` (dev) et `@prisma/client` ; `npx prisma init`.
2. Modèles `Product`, `Author`, `Review` + `enum AuthorType { amateur professional }`.
3. Noms snake_case via `@map` / `@@map` (`products`, `authors`, `reviews`, `first_name`, `reviewed_at`…).
4. Types : `@db.VarChar(20)`, `@db.VarChar(255)`, `@db.Text`, `@db.Decimal(10, 2)`, `@db.Char(3)`, `@db.SmallInt`, `@db.Timestamptz`, `@db.Timestamp`.
5. `@unique` sur `reference` ; `@@unique([firstName, lastName, type], map: "authors_identity_key")`.
6. Relations : `onDelete: Cascade` (product), `onDelete: Restrict` (author).
7. Index `@@index([productId, notation])` et `@@index([authorId])` avec les noms du document.

## Fait quand

- [x] `npx prisma validate` passe.
- [x] `npx prisma format` ne produit aucun diff.
