# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Contexte

Test technique fullstack (Adeo) : base PostgreSQL locale + API + dashboard Vue 3 (bonus) autour du catalogue `data/products.json`. L'énoncé est dans `README.md` (en anglais, ne pas le modifier). 

**État actuel :** seuls la spécification et les données existent. `backend/`, `frontend/`, `docker-compose.yml` et `.nvmrc` sont à créer selon les documents de conception, qui font référence :

- `docs/architecture.md` — stack, arborescence cible, contrat d'API, seed, règles front, justification des choix.
- `docs/database-schema.md` — modèle relationnel (tables, contraintes, index, mapping JSON → colonnes).

Toute décision qui s'écarte de ces documents doit aussi y être reportée (ils servent de support à l'entretien). Les docs sont rédigées en français.

## Fichiers `.env` — interdiction de lecture

**Ne jamais lire, afficher ni modifier un fichier `.env`** (`backend/.env`, `frontend/.env` ou tout autre `.env*` hors `.env.example`), que ce soit via Read, `cat`, `grep`, `source` ou tout autre moyen. Considérer qu'ils sont toujours présents et correctement renseignés à partir du `.env.example` correspondant. Pour connaître les variables attendues, se référer uniquement aux fichiers `.env.example`.

## Commandes (cibles prévues)

Prérequis : Docker, Node 24 (`nvm use`), npm. Deux applications indépendantes, chacune avec son `package.json` — pas de workspace, lancer les commandes dans le dossier concerné.

```bash
docker compose up -d                 # PostgreSQL 18 (postgres:18-alpine) sur localhost:5432

# backend/
cp .env.example .env                 # DATABASE_URL, PORT, CORS_ORIGIN
npm run start:dev                    # doit appliquer les migrations (prisma migrate deploy, via prestart:dev) puis seeder si vide
npx prisma migrate dev --name <nom>  # nouvelle migration
npm test                             # Vitest (unitaires uniquement) ; un seul test : npx vitest run path/to/file.spec.ts -t "<nom>"
npm run lint                         # oxlint --type-aware

# frontend/
cp .env.example .env                 # VITE_API_URL
npm run dev                          # http://localhost:5173
npm run lint                         # oxlint puis ESLint
npm run type-check                   # vue-tsc
npx vitest run path/to/file.spec.ts  # un seul test
```

API sur `http://localhost:3000/api/v1`, Swagger UI sur `/api/docs`, OpenAPI JSON sur `/api/docs-json`.

## Architecture

Front (Vue 3) → HTTP JSON → API NestJS → Prisma → PostgreSQL (Docker). Seule l'API accède à la base.

**Base de données** (3 tables : `products`, `authors`, `reviews`) :
- Les `CHECK` (`price >= 0`, `stock >= 0`, `notation BETWEEN 1 AND 5`) ne sont pas exprimables dans Prisma : les ajouter en SQL brut dans la migration initiale.
- Aucun agrégat stocké (moyenne, nombre d'avis) : toujours calculer en SQL à la requête (`groupBy`/`_count`/`_avg` ou `$queryRaw`), jamais en JS après chargement.
- Auteurs dédoublonnés sur `UNIQUE (first_name, last_name, type)` faute d'identifiant source.
- Volumétrie attendue après seed : 250 produits, 766 avis, 766 auteurs — utile pour vérifier le seed.

**Backend NestJS** (ESM : imports relatifs en `.js`, mocks `vi.fn()`) — modules `Config`, `Prisma`, `Seed`, `Products` (inclut la sous-ressource reviews), `Stats` :
- Controller = routage + Swagger uniquement ; Service = logique et requêtes ; DTO de sortie obligatoires (jamais d'entité Prisma renvoyée brute).
- Identifiant public = `reference`. Les `id` techniques (produits, auteurs) ne sont jamais exposés. JSON en camelCase.
- Routes `most-appreciated` et `lowest-rated` déclarées **avant** `:reference` dans le controller.
- « Avis positif » = `notation > 3` (strict) ; `lowest-rated` = moyenne `< 3`, tri croissant.
- Pas de pagination (choix assumé) ; l'over-fetching est évité par résumé en liste / détail séparé / avis en sous-ressource.
- `ValidationPipe` global (`whitelist`, `transform`) ; `limit` entier entre 1 et 50.
- Seed dans `onApplicationBootstrap` : idempotent (ne fait rien si `products` non vide) et atomique (`$transaction`).

**Frontend Vue 3** :
- Composition API exclusivement (`<script setup lang="ts">`) — exigence de l'énoncé, aucune Options API.
- PrimeVue avec thème par défaut, pas de CSS sur mesure ni d'animations.
- Un composable TanStack Vue Query par section du dashboard (`useStats`, `useMostAppreciated`, `useLowestRated`, `useProducts`), chacune avec ses propres états loading/error.
