# T11 — Seed : insertion au démarrage

**Phase :** 1 — Backend : socle et base de données  
**Dépend de :** [T09](./T09-prestart-migrations.md), [T10](./T10-seed-mapping.md)  
**Références :** docs/architecture.md §7

## Objectif

Remplir la base automatiquement, de façon idempotente et atomique.

## Fichiers concernés

- `backend/src/seed/seed.service.ts`
- `backend/src/seed/seed.module.ts`
- `backend/src/seed/seed.service.spec.ts`

## Étapes

1. `SeedService implements OnApplicationBootstrap`.
2. Si `product.count() > 0` → log « déjà rempli » et sortie.
3. Sinon : lire `data/products.json` (chemin résolu depuis la racine du dépôt), appeler le mapper.
4. Dans un `$transaction` interactif : `createMany` authors, products, puis récupérer les id et `createMany` reviews.
5. Log du nombre de lignes insérées.
6. Test unitaire (Prisma mocké) : rien n'est inséré si la base est non vide.

## Fait quand

- [x] Base neuve : `select count(*)` → 250 / 766 / 766.
- [x] Second démarrage : aucune insertion, log « déjà rempli ».
