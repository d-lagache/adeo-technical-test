# Stack technique et architecture

Ce document décrit la stack technique retenue, l'organisation du dépôt et l'architecture de l'application (base de données, API, dashboard). Le modèle relationnel est détaillé à part, dans [`database-schema.md`](./database-schema.md).

---

## 1. Vue d'ensemble

```mermaid
flowchart LR
    user([Navigateur])

    subgraph frontend["frontend/ — Vue 3 + Vite"]
        views[Vue Dashboard<br/>PrimeVue]
        composables[Composables<br/>TanStack Vue Query]
    end

    subgraph backend["backend/ — NestJS"]
        controllers[Controllers<br/>/api/v1]
        services[Services]
        prisma[PrismaService]
        seed[SeedService<br/>au démarrage]
    end

    subgraph docker["Docker Compose"]
        db[(PostgreSQL 18)]
    end

    json[/data/products.json/]

    user --> views --> composables -- HTTP JSON --> controllers --> services --> prisma --> db
    json --> seed --> prisma
```

- Le **front** ne parle qu'à l'API, en HTTP/JSON.
- L'**API** est la seule à accéder à la base, via Prisma.
- La **base** tourne en local dans un conteneur Docker dont la version est épinglée.
- Au démarrage, l'API **remplit la base** à partir de `data/products.json` si elle est vide.

---

## 2. Stack technique

| Couche          | Technologie                                     | Version          | Rôle                                                        |
|-----------------|-------------------------------------------------|------------------|-------------------------------------------------------------|
| Runtime         | Node.js                                         | 24 LTS (`.nvmrc`) | Exécution de l'API et outillage du front                    |
| Gestion paquets | npm                                             | fournie avec Node | Installation des dépendances, scripts                       |
| Base de données | PostgreSQL                                      | `postgres:18-alpine` | Stockage relationnel                                    |
| Conteneurs      | Docker Compose                                  | v2 (spec Compose) | Lancement local et versionné de PostgreSQL                 |
| Langage         | TypeScript                                      | 6.0              | Typage du backend et du frontend                            |
| Backend         | NestJS (`@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`) / `@nestjs/cli` | 12.6 / 12.0 | API REST                    |
| ORM             | Prisma (`prisma`, `@prisma/client`, `@prisma/adapter-pg`) | 7.10   | Schéma, migrations, client typé                             |
| Documentation API | `@nestjs/swagger` (OpenAPI + Swagger UI)      | 12.1             | Documentation générée et interactive                        |
| Validation      | `class-validator` + `class-transformer`         | 0.15 / 0.5       | Validation des paramètres d'entrée (`ValidationPipe`)       |
| Configuration   | `@nestjs/config`                                | 12.1             | Lecture et validation des variables d'environnement         |
| Frontend        | Vue 3 (Composition API, `<script setup>`)       | 3.5              | Dashboard                                                   |
| Build front     | Vite + `@vitejs/plugin-vue` + `vue-tsc`         | 8.3 / 6.0 / 3.3  | Serveur de dev, build et vérification de types              |
| UI              | PrimeVue + `@primeuix/themes` (preset Aura aux couleurs ADEO) + `primeicons` | 4.5 / 2.0 / 7.0 | Bibliothèque de composants, thème et icônes |
| Données front   | TanStack Vue Query (`@tanstack/vue-query`)      | 5.108            | Appels API, cache, états loading/error                      |
| Tests API       | Vitest (`vitest`, `@vitest/coverage-v8`)        | 5.1              | Tests unitaires                                             |
| Tests front     | Vitest + `@vue/test-utils`                      | 5.1 / 2.6        | Tests unitaires                                             |
| Qualité API     | oxlint (`--type-aware`) / Prettier              | 1.95 / 3.10      | Lint et formatage du backend                                |
| Qualité front   | oxlint + ESLint (`typescript-eslint`, `eslint-plugin-vue`) / Prettier | 1.82 / 10.15 / 8.74 / 3.10 | Lint et formatage du frontend      |

Versions stables relevées sur le registre npm à l'initialisation (novembre 2026), au format majeur.mineur. Les `package.json` déclarent des plages `^` sur ces versions ; les versions exactes sont figées par le `package-lock.json` de chaque application, versionné.

- **Prisma 7.10 et non 8** : le tag `latest` de `prisma` pointe sur une *release candidate* (`8.0.0-rc`) ; on reste sur la dernière version stable, alignée avec `@prisma/client`.
- **TypeScript 6.0 et non 7** : `@nestjs/cli` 12 embarque TypeScript `~6.0` et `typescript-eslint` (front) exige `< 6.1`.
- **Backend en ESM, testé avec Vitest et linté avec oxlint** : ce sont les choix par défaut du CLI NestJS 12, dont les paquets sont désormais *ESM-only*. Jest ne gère l'ESM qu'en mode expérimental (`--experimental-vm-modules`) ; Vitest le gère nativement et c'est aussi le runner du front, donc un seul outil de test pour tout le dépôt. Conséquences : `"type": "module"`, imports relatifs suffixés par `.js`, `import.meta.dirname` au lieu de `__dirname`, mocks en `vi.fn()`.
- **PrimeVue 4.5 et non 5** : depuis la v5, PrimeVue (et `@primeuix/themes` 3) n'est plus sous licence MIT mais sous licence commerciale PrimeUI, avec une clé de licence obligatoire (une notice s'affiche sans clé). La 4.5, dernière version MIT, fournit tous les composants utiles au dashboard ; elle s'utilise avec `@primeuix/themes` 2.0 (preset `Aura`). Même situation pour `primeicons` : la 8 passe sous licence PrimeUI, on reste sur la 7.0 (MIT).
- **Front généré avec `create-vue`** (`--ts --vitest --eslint --prettier --bare`, sans router ni Pinia : un seul écran, l'état serveur est porté par Vue Query). Le template épingle Vitest 4 : il est monté en 5.1 pour avoir la même version que le backend, et Prettier en 3.10. Il lint en deux passes, oxlint puis ESLint (`eslint-plugin-oxlint` désactive dans ESLint les règles déjà couvertes par oxlint) ; ce choix par défaut est conservé. Le template déclare `engines.node` `^22.18.0 || >=24.12.0` : utiliser une version 24 récente (`nvm install 24`).
- **Scaffold nettoyé** : le CLI ajoute `@nestjs/observe` (télémétrie vers un service SaaS externe) et `@nestjs/mau` (déploiement) ; ils sont retirés, hors périmètre d'un test local.

---

## 3. Arborescence du dépôt

Le dépôt contient deux applications **indépendantes**, chacune avec son propre `package.json`, sans workspace.

```
.
├── docker-compose.yml          # PostgreSQL local (version épinglée)
├── .nvmrc                      # Version de Node (24)
├── data/
│   └── products.json           # Jeu de données source
├── docs/
│   ├── architecture.md         # Ce document
│   └── database-schema.md      # Modèle relationnel
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── prisma.config.ts        # Configuration Prisma 7 (schéma, migrations, DATABASE_URL)
│   ├── prisma/
│   │   ├── schema.prisma       # Modèle Prisma
│   │   └── migrations/         # Migrations SQL versionnées
│   ├── src/
│   │   ├── main.ts             # Bootstrap, préfixe /api/v1, Swagger, ValidationPipe
│   │   ├── app.module.ts
│   │   ├── common/             # Éléments transverses (DTO d'erreur documenté dans Swagger)
│   │   ├── config/             # Schéma et validation de l'environnement
│   │   ├── prisma/             # PrismaModule / PrismaService
│   │   ├── seed/               # SeedModule / SeedService
│   │   ├── products/           # Controller, service, DTO (produits + sous-ressource reviews)
│   │   └── stats/              # Controller, service, DTO (KPI)
└── frontend/
    ├── package.json
    ├── .env.example
    └── src/
        ├── main.ts             # Création de l'app, PrimeVue (preset ADEO), VueQueryPlugin
        ├── theme/              # adeoPreset : preset Aura aux couleurs ADEO
        ├── api/                # Client HTTP et types des réponses
        ├── composables/        # useStats, useProducts, useMostAppreciated…
        ├── components/         # KpiBar, ProductCards, ProductTable…
        ├── utils/              # Fonctions pures partagées (formatPrice)
        └── views/              # DashboardView
```

---

## 4. Base de données

### 4.1 Lancement avec Docker Compose

PostgreSQL tourne dans un conteneur défini dans `docker-compose.yml` à la racine :

| Élément       | Valeur                                                          |
|---------------|-----------------------------------------------------------------|
| Image         | `postgres:18-alpine`                                            |
| Port          | `5432` exposé sur `localhost`                                   |
| Volume        | Volume nommé `pgdata` monté sur `/var/lib/postgresql`, pour conserver les données entre deux redémarrages |
| Healthcheck   | `pg_isready`                                                    |
| Variables     | `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` (valeurs de dev : `adeo` / `adeo` / `adeo`) |

À partir de PostgreSQL 18, l'image officielle place les données dans `/var/lib/postgresql/18/docker` (`PGDATA` versionné par majeure). Le volume est donc monté sur le répertoire parent `/var/lib/postgresql` et non plus sur `/var/lib/postgresql/data` comme avant. Les identifiants sont écrits en clair dans `docker-compose.yml` : il s'agit d'une base locale de développement ; l'API s'y connecte via `DATABASE_URL=postgresql://adeo:adeo@localhost:5432/adeo`.

La base est considérée comme **déjà démarrée** quand on lance l'API (`docker compose up -d`).

### 4.2 Suivi des versions de PostgreSQL

- La version majeure est **écrite dans le dépôt** (tag de l'image). Tous les développeurs utilisent donc la même.
- Pour une **version mineure** (ex. 18.1 → 18.2), il suffit de faire un `docker compose pull` : le format des données ne change pas.
- Pour une **version majeure** (ex. 18 → 19), on modifie le tag dans `docker-compose.yml`, on fait un `pg_dump` avant, puis une restauration dans le nouveau volume. Le changement est tracé dans l'historique git.

### 4.3 Schéma et migrations

- Le schéma est décrit dans `backend/prisma/schema.prisma` et correspond à [`database-schema.md`](./database-schema.md).
- Les migrations sont générées par `prisma migrate dev` puis versionnées dans `prisma/migrations/`.
- Prisma 7 : la configuration CLI (chemin du schéma, des migrations, `DATABASE_URL`) est dans `backend/prisma.config.ts`, et le client se connecte via le *driver adapter* `@prisma/adapter-pg` passé au constructeur de `PrismaClient` dans `PrismaService`.
- L'ENUM `author_type` est géré nativement par Prisma (`enum AuthorType`).
- Prisma ne sait pas déclarer les contraintes `CHECK` (`price >= 0`, `stock >= 0`, `notation BETWEEN 1 AND 5`). On les ajoute **à la main, en SQL**, dans la migration initiale.
- Prisma génère des clés `SERIAL` pour `@default(autoincrement())`. Dans la migration initiale, on les remplace à la main par `INTEGER GENERATED ALWAYS AS IDENTITY` (forme standard SQL recommandée par PostgreSQL, qui interdit d'insérer un `id` à la main). Prisma traite ces deux formes de la même façon : `prisma migrate diff` ne détecte aucune dérive.

---

## 5. Backend NestJS

### 5.1 Modules

| Module           | Responsabilité                                                                 |
|------------------|--------------------------------------------------------------------------------|
| `ConfigModule`   | Charge `.env` et valide les variables (`DATABASE_URL`, `PORT`…) au démarrage : schéma `class-validator` dans `config/env.validation.ts`, l'API refuse de démarrer si la configuration est invalide |
| `PrismaModule`   | Fournit un `PrismaService` unique (connexion et déconnexion propres)           |
| `SeedModule`     | Remplit la base au démarrage si elle est vide (voir §7)                        |
| `ProductsModule` | Produits : liste, détail, classements, et sous-ressource `reviews`             |
| `StatsModule`    | Indicateurs globaux du catalogue (KPI)                                         |

### 5.2 Couches

```mermaid
flowchart LR
    req([Requête HTTP]) --> pipe[ValidationPipe] --> ctrl[Controller] --> svc[Service] --> prisma[PrismaService] --> db[(PostgreSQL)]
    svc --> dto[DTO de sortie] --> res([Réponse JSON])
```

- **Controller** : routage, lecture des paramètres, annotations Swagger. Aucune logique métier.
- **Service** : logique métier et requêtes Prisma. Les agrégats (nombre d'avis, moyenne, classements) sont **calculés en SQL**, avec `groupBy`/`_count`/`_avg` de Prisma ou `$queryRaw` si besoin. Le résumé produit utilise un `$queryRaw` (`LEFT JOIN reviews` + `GROUP BY`) : une seule requête, les produits sans avis restent présents (0 avis, moyenne `null`), et le tri par agrégat avec `LIMIT` des classements s'y exprime directement. Les colonnes du résumé sont un fragment `Prisma.sql` partagé par toutes ces requêtes ; le nombre d'avis positifs des « plus appréciés » est un agrégat filtré (`COUNT(r.id) FILTER (WHERE r.notation > 3)`). Les avis d'un produit sont lus en une requête Prisma (`product.findUnique` avec un `select` imbriqué sur `reviews` et `author`, trié par date décroissante) : le `select` plutôt qu'un `include` ne charge que les champs exposés, sans aucun `id`, et un produit absent (`null`, donc 404) se distingue d'un produit sans avis (`[]`). La conversion `Decimal` → number et l'arrondi de la moyenne à 2 décimales se font dans le mapping vers le DTO.
- **DTO de sortie** : forme exacte de la réponse. Les entités Prisma ne sont jamais renvoyées telles quelles, ce qui permet de cacher les id techniques et de choisir les champs exposés.

### 5.3 Configuration transverse (`main.ts`)

- Préfixe global : `api/v1`.
- `ValidationPipe` global (`whitelist`, `transform`). Il valide et convertit les query params, par exemple `limit` en entier compris entre 1 et 50.
- Swagger UI disponible sur `/api/docs`, et JSON OpenAPI sur `/api/docs-json`.
  Le plugin CLI `@nestjs/swagger` (déclaré dans `nest-cli.json`, option `introspectComments`) déduit les schémas des types TypeScript des DTO et reprend leurs commentaires JSDoc comme descriptions, et leurs balises `@example` comme exemples : peu de décorateurs `@ApiProperty` à écrire. Les exemples reprennent le produit `59033201` du jeu de données.
  Chaque route a un `@ApiOperation` (résumé + règle métier), un schéma de réponse 200 et ses codes d'erreur (`400` sur les classements, `404` sur les routes `:reference`). Les erreurs sont documentées par `ApiErrorDto` (`common/dto/`), qui décrit le format NestJS par défaut sans le modifier.
- CORS activé pour l'origine du front.

---

## 6. Contrat d'API

Toutes les routes sont publiques, en lecture seule (`GET`), et préfixées par `/api/v1`.

| Méthode | Route                                   | Description                                              | Réponse                                                                                       |
|---------|-----------------------------------------|----------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| `GET`   | `/products`                             | Catalogue complet, sous forme résumée                    | `ProductSummary[]` : `reference`, `name`, `price`, `currency`, `stock`, `reviewsCount`, `averageNotation` |
| `GET`   | `/products/most-appreciated?limit=5`    | Produits ayant le plus d'avis positifs (`notation > 3`)  | `ProductSummary[]` + `positiveReviewsCount`                                                   |
| `GET`   | `/products/lowest-rated?limit=5`        | Produits les moins bien notés (moyenne `< 3`)            | `ProductSummary[]`, triés par `averageNotation` croissante                                    |
| `GET`   | `/products/:reference`                  | Détail d'un produit, sans ses avis                       | `ProductDetail` : résumé + `description`                                                      |
| `GET`   | `/products/:reference/reviews`          | Avis d'un produit, auteur inclus                         | `Review[]` : `notation`, `comment`, `date`, `author { firstName, lastName, type }`             |
| `GET`   | `/stats`                                | Indicateurs globaux                                      | `{ totalProducts, totalReviews }`                                                             |

### Conventions

- **JSON en camelCase**. Les colonnes `snake_case` de la base sont converties par les DTO.
- **Identifiant public** : la `reference` du produit. L'`id` technique n'est jamais exposé, pas plus que celui des auteurs.
- **Pas de pagination** : le volume est faible (250 produits) et le README précise « No filtering or pagination required ». L'over-fetching est évité autrement : un résumé en liste, le détail à part, les avis en sous-ressource.
- **Ordre des routes** : `most-appreciated` et `lowest-rated` sont déclarées **avant** `:reference` dans le controller, sinon NestJS les interpréterait comme une référence.
- **Codes HTTP** : `200` en cas de succès, `400` pour un paramètre invalide, `404` pour une référence inconnue.
- **Format d'erreur** : celui de NestJS par défaut, `{ statusCode, message, error }`.

---

## 7. Seed au démarrage

Le seed est déclenché par le `SeedService` dans le hook `onApplicationBootstrap`.

```mermaid
sequenceDiagram
    participant App as API NestJS
    participant Seed as SeedService
    participant DB as PostgreSQL

    App->>Seed: onApplicationBootstrap()
    Seed->>DB: SELECT count(*) FROM products
    alt base déjà remplie
        Seed-->>App: rien à faire (log)
    else base vide
        Seed->>Seed: lecture de data/products.json
        Seed->>Seed: dédoublonnage des auteurs (first_name, last_name, type)
        Seed->>DB: BEGIN
        Seed->>DB: INSERT authors
        Seed->>DB: INSERT products
        Seed->>DB: INSERT reviews (product_id, author_id)
        Seed->>DB: COMMIT
        Seed-->>App: log du nombre de lignes insérées
    end
```

- **Idempotent** : on n'insère rien si la table `products` contient déjà des lignes.
- **Atomique** : tout se fait dans une transaction Prisma (`$transaction`). Une erreur annule tout et la base reste vide.
- **Mise en œuvre** : la transformation JSON → lignes est une fonction pure (`seed/seed.mapper.ts`, testée sans base). Dans la transaction interactive, `createManyAndReturn` insère auteurs et produits en renvoyant leurs id, ce qui permet de relier les avis (`createMany`) sans requête de relecture. Trois requêtes d'insertion au total.
- **Volumétrie attendue** : 250 produits, 766 avis, 766 auteurs.

---

## 8. Frontend Vue 3

### 8.1 Règles

- **Composition API uniquement** : tous les composants sont écrits en `<script setup lang="ts">`. Jamais de `data()`, `methods` ou `computed: {}`.
- **PrimeVue avec un preset Aura aux couleurs ADEO** : `theme/adeoPreset.ts` (`definePreset(Aura, …)`) remplace la palette primaire par le teal des tokens du design system ADEO Mozaic (`@mozaic-ds/tokens`) ; la couleur primaire est `#007783` (`primary.600`, contraste AA avec du texte blanc). Mode clair uniquement (`darkModeSelector: false`), comme le thème ADEO de Mozaic. Toujours pas de CSS sur mesure ni d'animations : seulement de la mise en page en `style` inline et les variables du thème (`var(--p-primary-color)`…).
- Icônes : `primeicons`, le pack officiel de PrimeVue.
- L'URL de l'API est lue dans `VITE_API_URL`.

### 8.2 Écran Dashboard

| Section                    | Composant PrimeVue envisagé | Endpoint                               | Composable            |
|----------------------------|-----------------------------|----------------------------------------|-----------------------|
| Bandeau KPI                | `Card`                      | `GET /stats`                           | `useStats()`          |
| 5 produits les plus appréciés | `Card` / `DataView`      | `GET /products/most-appreciated?limit=5` | `useMostAppreciated()` |
| 5 produits les moins bien notés | `Card` / `DataView`    | `GET /products/lowest-rated?limit=5`   | `useLowestRated()`    |
| Catalogue complet          | `DataTable`, sans pagination | `GET /products`                       | `useProducts()`       |

### 8.3 Accès aux données

Chaque section a son composable, construit sur `useQuery` de TanStack Vue Query :

```ts
// composables/useStats.ts
export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => api.get<Stats>('/stats'),
  })
}
```

- Chaque section se charge **indépendamment**, avec ses propres états loading et error.
- Vue Query est **100 % Composition API** : `useQuery` s'appelle dans `<script setup>` ou dans un composable. La seule ligne hors composant est `app.use(VueQueryPlugin)` dans `main.ts`.

---

## 9. Démarrage local

**Prérequis :** Docker et Node 24 (`nvm use`).

```bash
# 1. Base de données (une fois)
docker compose up -d

# 2. API : une seule commande (migrations + seed automatique si la base est vide)
cd backend
cp .env.example .env
npm install
npm run start:dev        # http://localhost:3000/api/v1 — docs : /api/docs

# 3. Front (bonus)
cd frontend
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

| Fichier                 | Variables                                   |
|-------------------------|---------------------------------------------|
| `backend/.env.example`  | `DATABASE_URL`, `PORT`, `CORS_ORIGIN`        |
| `frontend/.env.example` | `VITE_API_URL`                              |

**Migrations automatiques.** Les scripts `prestart`, `prestart:dev` et `prestart:debug` appellent `npm run db:deploy` (`prisma migrate deploy && prisma generate`) : `npm run start:dev` applique donc les migrations en attente avant de lancer l'API, puis le seed remplit la base si elle est vide. Le client Prisma est aussi généré au `postinstall`. Pour que ce `postinstall` passe sans `.env` (clone neuf, CI), `prisma.config.ts` lit `process.env.DATABASE_URL` au lieu de `env('DATABASE_URL')` : `prisma generate` n'a pas besoin de la base, seules les commandes `migrate` exigent la variable.

---

## 10. Qualité

- **Lint et formatage** : Prettier dans les deux applications ; oxlint (avec règles typées) côté API ; oxlint puis ESLint côté front (`npm run lint`), plus la vérification de types des `.vue` par `vue-tsc` (`npm run type-check`).
- **Tests API** :
  - unitaires (Vitest), sur les services, et en particulier sur les calculs d'agrégats ;
- **Tests front** : Vitest, sur les composables et les composants clés.

---

## 11. Justification des choix

- **Docker Compose pour PostgreSQL.** Le README demande une solution qui permette de suivre le cycle de vie des versions de PostgreSQL. Avec un tag d'image versionné dans le dépôt, la version est explicite, la même pour tous, et chaque montée de version laisse une trace dans git. La base reste locale, comme l'exige le README.
- **PostgreSQL 18.** C'est la dernière version majeure stable, celle qui aura le support le plus long.
- **NestJS.** Le framework impose une structure (modules, controllers, services, injection de dépendances) qui rend la séparation des responsabilités visible. Il s'intègre directement avec Swagger, la validation et la configuration.
- **Prisma.** Le schéma est déclaratif et lisible, les migrations sont versionnées et le client est typé de bout en bout. Ses limites sont connues : les `CHECK` s'écrivent en SQL brut, et les agrégats complexes peuvent demander `$queryRaw`.
- **REST + OpenAPI.** Le README insiste sur l'**affordance** et une documentation utilisable « without looking at the source code ». Des ressources REST bien nommées et un Swagger généré à partir du code (donc toujours à jour) répondent directement à ces deux points.
- **`reference` dans les URLs, préfixe `/api/v1`.** La référence est la clé métier stable et lisible, alors que l'id technique est un détail d'implémentation. Le préfixe de version permet de faire évoluer le contrat sans casser les clients existants.
- **Endpoints métier dédiés pour le dashboard.** Le nom `most-appreciated` ou `lowest-rated` dit directement ce que l'endpoint renvoie (affordance). Le calcul est fait en SQL côté serveur, et le front ne reçoit que les 5 produits utiles au lieu de tout le catalogue (performance).
- **Pas de pagination.** Le README l'écarte explicitement, et 250 produits en version résumée font une réponse légère. Pour éviter l'over-fetching, on sépare plutôt la liste et le détail, et on expose les avis en sous-ressource.
- **Périmètre d'exposition limité au dashboard.** Les avis sont exposés par `/products/:reference/reviews` et chaque avis inclut son auteur. Il n'y a ni `/reviews` global ni `/authors`. Les trois ressources demandées par le README (« Expose products, reviews, and authors ») sont donc bien accessibles, mais pas toutes au premier niveau : on n'ajoute pas d'endpoints sans cas d'usage. Extension possible : `GET /authors/:id/reviews`. Faute de clé métier pour les auteurs, il faudrait alors exposer leur id technique.
- **Seed automatique au démarrage, si la base est vide.** L'API démarre en une commande sur une base neuve, sans étape manuelle. Le contrôle « base vide » rend le seed idempotent, et la transaction évite de laisser une base à moitié remplie.
- **Dossiers séparés `backend/` et `frontend/`.** Les deux applications n'ont rien à partager et leurs cycles sont indépendants. Des workspaces n'apporteraient que de la complexité.
- **Node 24 LTS et npm.** C'est la LTS la plus récente, et npm est fourni avec Node, donc aucun outil supplémentaire n'est à installer.
- **PrimeVue.** La bibliothèque est complète et adaptée aux dashboards (`DataTable`, `Card`, `DataView`), ce qui permet d'avoir une interface propre sans CSS sur mesure, comme le demande le README.
- **Preset aux couleurs ADEO plutôt que le thème par défaut.** Le système de thème de PrimeVue est piloté par des design tokens : `definePreset` remplace la palette primaire d'Aura par celle du design system ADEO (Mozaic), sans écrire de CSS. L'interface est aux couleurs de l'enseigne tout en restant le thème standard pour tout le reste.
- **TanStack Vue Query.** Il gère le cache et les états loading/error de chaque section sans code répétitif. Il est conçu pour la Composition API (fonctions `useQuery`), ce qui respecte la règle « Composition API exclusively ».
