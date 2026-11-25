# Backend — API catalogue

API REST NestJS en lecture seule qui expose les produits du catalogue `data/products.json`, leurs avis et les auteurs de ces avis, stockés dans une base PostgreSQL locale.

- Stack : NestJS 12 (ESM), Prisma 7, PostgreSQL 18, Swagger / OpenAPI, Vitest, oxlint.
- Conception détaillée : [`docs/architecture.md`](../docs/architecture.md) (stack, contrat d'API, seed, justification des choix) et [`docs/database-schema.md`](../docs/database-schema.md) (modèle relationnel).

## Prérequis

- **Docker** (avec Docker Compose v2), pour PostgreSQL.
- **Node 24** : `nvm use` à la racine du dépôt (fichier `.nvmrc`).
- **npm**, fourni avec Node.

## Démarrage

Depuis la racine du dépôt :

```bash
# 1. Base PostgreSQL 18 sur localhost:5432 (une seule fois, les données sont conservées dans un volume)
docker compose up -d

# 2. API
cd backend
cp .env.example .env
npm install
npm run start:dev
```

`npm run start:dev` est la seule commande de démarrage. Elle :

1. applique les migrations en attente (`prisma migrate deploy`, via le script `prestart:dev`) et génère le client Prisma ;
2. lance l'API en mode watch ;
3. remplit la base à partir de `data/products.json` si la table `products` est vide (seed idempotent et transactionnel).

Au premier démarrage, le log doit indiquer l'insertion de **250 produits, 766 avis et 766 auteurs**. Aux démarrages suivants, le seed est ignoré.

L'API répond alors sur `http://localhost:3000/api/v1`.

## Variables d'environnement

Lues dans `backend/.env` (modèle : [`.env.example`](./.env.example)) et validées au démarrage : l'API refuse de démarrer si une valeur est absente ou invalide.

| Variable       | Obligatoire | Défaut                  | Rôle                                                     |
|----------------|-------------|-------------------------|----------------------------------------------------------|
| `DATABASE_URL` | oui         | —                       | Connexion PostgreSQL. Avec `docker-compose.yml` : `postgresql://adeo:adeo@localhost:5432/adeo` |
| `PORT`         | non         | `3000`                  | Port HTTP de l'API                                       |
| `CORS_ORIGIN`  | non         | `http://localhost:5173` | Origine autorisée par CORS (dashboard Vite)              |

## Documentation de l'API

| Ressource       | URL                                     |
|-----------------|-----------------------------------------|
| Swagger UI      | http://localhost:3000/api/docs          |
| OpenAPI (JSON)  | http://localhost:3000/api/docs-json     |

Swagger UI décrit chaque route (règle métier, paramètres, schéma de réponse avec exemples, codes d'erreur) et permet de l'appeler directement (« Try it out »). La documentation est générée depuis le code, elle est donc toujours à jour.

## Routes

Toutes les routes sont publiques, en `GET`, préfixées par `/api/v1`, et renvoient du JSON en camelCase. Le produit est identifié par sa `reference` ; aucun identifiant technique n'est exposé.

| Route                                  | Description                                                                 | Codes         |
|----------------------------------------|-----------------------------------------------------------------------------|---------------|
| `/products`                            | Catalogue complet en version résumée (sans description ni avis), trié par référence | 200           |
| `/products/most-appreciated?limit=5`   | Produits ayant le plus d'avis positifs (note `> 3`), avec `positiveReviewsCount` (produits sans avis positif exclus) | 200, 400      |
| `/products/lowest-rated?limit=5`       | Produits dont la note moyenne est `< 3`, par moyenne croissante (produits sans avis exclus) | 200, 400      |
| `/products/:reference`                 | Détail d'un produit (résumé + `description`), sans ses avis                 | 200, 404      |
| `/products/:reference/reviews`         | Avis du produit, du plus récent au plus ancien, auteur inclus (`[]` si aucun avis) | 200, 404      |
| `/stats`                               | Indicateurs globaux : `totalProducts`, `totalReviews`                       | 200           |

- `limit` : entier entre 1 et 50, 5 par défaut. Hors bornes ou non entier → `400`.
- Pas de pagination : le catalogue compte 250 produits (choix détaillé dans `docs/architecture.md` §6).
- Erreurs au format NestJS par défaut : `{ "statusCode": 404, "message": "Produit 00000000 introuvable", "error": "Not Found" }`. Pour une erreur de validation, `message` est la liste des contraintes violées (messages par défaut de `class-validator`, en anglais).
- `date` d'un avis : ISO 8601 **sans fuseau** (`2025-04-06T02:09:10`), comme la source ; à lire telle quelle, sans conversion de fuseau.

### Exemples

```bash
curl http://localhost:3000/api/v1/stats
# {"totalProducts":250,"totalReviews":766}

curl http://localhost:3000/api/v1/products

curl "http://localhost:3000/api/v1/products/most-appreciated?limit=5"

curl "http://localhost:3000/api/v1/products/lowest-rated?limit=5"

curl http://localhost:3000/api/v1/products/59033201
# {"reference":"59033201","name":"Non dolor minim …","price":972.5,"currency":"EUR","stock":415,
#  "reviewsCount":3,"averageNotation":4.33,"description":"Labore est dolor …"}

curl http://localhost:3000/api/v1/products/59033201/reviews
# [{"notation":5,"comment":"Very practical and easy to use.","date":"2025-04-06T02:09:10",
#   "author":{"firstName":"Poha","lastName":"Kuxero","type":"professional"}}, …]

curl -i http://localhost:3000/api/v1/products/00000000
# HTTP/1.1 404 Not Found

curl -i "http://localhost:3000/api/v1/products/most-appreciated?limit=51"
# HTTP/1.1 400 Bad Request
```

## Scripts

| Commande                               | Effet                                                                |
|----------------------------------------|----------------------------------------------------------------------|
| `npm run start:dev`                    | Migrations + génération du client Prisma, puis API en mode watch     |
| `npm run build` / `npm run start:prod` | Build dans `dist/`, puis lancement du build                          |
| `npm run db:deploy`                    | Applique les migrations et génère le client Prisma                   |
| `npx prisma migrate dev --name <nom>`  | Crée une nouvelle migration à partir de `prisma/schema.prisma`       |
| `npm test`                             | Tests unitaires (Vitest)                                             |
| `npx vitest run <fichier> -t "<nom>"`  | Un seul test                                                         |
| `npm run lint`                         | Lint (oxlint, règles typées)                                         |
| `npm run format`                       | Formatage (Prettier)                                                 |

## Réinitialiser la base

Le seed ne s'exécute que sur une base vide. Pour repartir de zéro :

```bash
docker compose down -v   # supprime le conteneur et le volume pgdata
docker compose up -d
cd backend && npm run start:dev   # migrations puis seed
```

## Organisation du code

```
src/
├── main.ts         # Préfixe /api/v1, ValidationPipe global, CORS, Swagger
├── app.module.ts
├── config/         # Validation des variables d'environnement
├── prisma/         # PrismaService (connexion via @prisma/adapter-pg)
├── seed/           # Transformation du JSON (fonction pure) et insertion au démarrage
├── products/       # Produits, classements et sous-ressource reviews
├── stats/          # Indicateurs globaux
├── common/         # DTO d'erreur documenté dans Swagger
└── generated/      # Client Prisma généré (postinstall / db:deploy), ignoré par git
prisma/
├── schema.prisma   # Modèle Prisma
└── migrations/     # Migrations SQL versionnées (dont les contraintes CHECK)
```

Controller = routage et documentation Swagger ; service = logique et requêtes ; DTO de sortie = forme exacte des réponses. Les agrégats (nombre d'avis, moyenne, classements) sont calculés en SQL à chaque requête.
