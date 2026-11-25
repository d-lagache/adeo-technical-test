# T10 — Seed : transformation du JSON (fonction pure)

**Phase :** 1 — Backend : socle et base de données  
**Dépend de :** [T06](./T06-prisma-schema.md)  
**Références :** docs/database-schema.md §7, docs/architecture.md §7

## Objectif

Isoler la transformation `products.json` → lignes à insérer, testable sans base.

## Fichiers concernés

- `backend/src/seed/seed.mapper.ts`
- `backend/src/seed/seed.mapper.spec.ts`
- `backend/src/seed/source.types.ts`

## Étapes

1. Typer la source (`SourceProduct`, `SourceReview`, `SourceAuthor`).
2. Fonction pure qui renvoie `{ products, authors, reviews }`, avec auteurs dédoublonnés sur `(firstName, lastName, type)`.
3. Chaque review référence son produit (par `reference`) et son auteur (par clé d'identité).
4. Tests : dédoublonnage de deux auteurs identiques, produit sans avis, comptes sur le vrai fichier.

## Fait quand

- [x] `npx vitest run src/seed` passe.
- [x] Le test sur `data/products.json` vérifie 250 produits, 766 avis, 766 auteurs.
