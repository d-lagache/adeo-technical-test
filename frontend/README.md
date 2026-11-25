# Frontend — Dashboard catalogue

Dashboard Vue 3 en lecture seule qui affiche les indicateurs, les classements et le catalogue complet servis par l'API du dossier [`backend/`](../backend/README.md), ainsi qu'une page de détail par produit avec ses avis.

- Stack : Vue 3.5 (Composition API, `<script setup lang="ts">`), Vite 8, PrimeVue 4.5 avec un preset Aura aux couleurs ADEO, `primeicons` 7, vue-router 5, TanStack Vue Query 5, Vitest, oxlint + ESLint, Prettier.
- Conception détaillée : [`docs/architecture.md`](../docs/architecture.md) (§8 pour le front : règles, écrans, accès aux données) et [`docs/database-schema.md`](../docs/database-schema.md) (modèle relationnel derrière l'API).

## Prérequis

- **Node 24** : `nvm use` à la racine du dépôt (fichier `.nvmrc`). Le template Vite exige `>=24.12.0` : `nvm install 24` si la version locale est plus ancienne.
- **npm**, fourni avec Node.
- **L'API démarrée** sur `http://localhost:3000` : suivre le [README du backend](../backend/README.md) (`docker compose up -d`, puis `npm run start:dev` dans `backend/`). Sans API, le dashboard s'affiche mais chaque section montre un message d'erreur.

## Démarrage

Depuis la racine du dépôt, l'API étant lancée :

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Le dashboard est alors disponible sur `http://localhost:5173`.

Cette origine est celle qu'autorise l'API par défaut (`CORS_ORIGIN=http://localhost:5173` dans `backend/.env`). Si Vite démarre sur un autre port (5173 déjà occupé), adapter `CORS_ORIGIN` côté backend et redémarrer l'API.

## Variables d'environnement

Lues dans `frontend/.env` (modèle : [`.env.example`](./.env.example)).

| Variable       | Obligatoire | Valeur par défaut du modèle      | Rôle                                         |
|----------------|-------------|----------------------------------|----------------------------------------------|
| `VITE_API_URL` | oui         | `http://localhost:3000/api/v1`   | URL de base de l'API, préfixe `/api/v1` inclus |

Vite injecte la variable au démarrage du serveur de dev et au build : après une modification, relancer `npm run dev` (ou `npm run build`).

## Scripts

| Commande                         | Effet                                                                   |
|----------------------------------|-------------------------------------------------------------------------|
| `npm run dev`                    | Serveur de dev Vite avec rechargement à chaud (`http://localhost:5173`) |
| `npm test`                       | Tests unitaires (Vitest + `@vue/test-utils`, environnement jsdom)       |
| `npm run test:unit`              | Tests unitaires en mode watch                                           |
| `npx vitest run <fichier> -t "<nom>"` | Un seul fichier ou un seul test                                    |
| `npm run lint`                   | Lint en deux passes, oxlint puis ESLint (corrige ce qui peut l'être)    |
| `npm run type-check`             | Vérification de types, `.vue` compris (`vue-tsc`)                       |
| `npm run build`                  | Vérification de types et build de production dans `dist/`              |
| `npm run preview`                | Sert le build de `dist/` localement                                     |
| `npm run format`                 | Formatage de `src/` (Prettier)                                          |

## Écrans

### Dashboard — `/`

| Section                          | Composant                                 | Endpoint                                   | Composable             |
|----------------------------------|-------------------------------------------|--------------------------------------------|------------------------|
| Bandeau KPI                      | `KpiBar` (nombre de produits et d'avis)   | `GET /stats`                               | `useStats()`           |
| Produits les plus appréciés (5)  | `MostAppreciatedSection` → `ProductCards` | `GET /products/most-appreciated?limit=5`   | `useMostAppreciated()` |
| Produits les moins bien notés (5)| `LowestRatedSection` → `ProductCards`     | `GET /products/lowest-rated?limit=5`       | `useLowestRated()`     |
| Catalogue complet (250 produits) | `CatalogueSection` → `ProductCards`       | `GET /products`                            | `useProducts()`        |

Les trois listes utilisent la même carte, `ProductCard` : nom, référence, prix et note (`ProductRating` : étoiles + « 4,2 / 5 (12 avis) », ou « Pas encore d'avis »). Chaque carte est un lien vers la page de détail du produit. L'ordre des produits est celui renvoyé par l'API ; il n'y a ni filtre ni pagination.

### Détail produit — `/products/:reference`

Page chargée à la demande (le dashboard n'embarque pas son code). Le titre « Dashboard catalogue » ramène au dashboard.

| Bloc         | Contenu                                                              | Endpoint                             | Composable                     |
|--------------|----------------------------------------------------------------------|--------------------------------------|--------------------------------|
| Produit      | Nom, référence, prix, stock, note, description                       | `GET /products/:reference`           | `useProduct(reference)`        |
| Avis clients | Note, auteur, type (Professionnel / Amateur), date, commentaire      | `GET /products/:reference/reviews`   | `useProductReviews(reference)` |

- Une référence inconnue (404) affiche « Produit introuvable » ; elle n'est pas rejouée (`retryUnlessNotFound`), contrairement aux autres erreurs (3 essais).
- Un produit sans avis affiche « Aucun avis ».

### États de chargement

Chaque section a son propre composable TanStack Vue Query, donc ses propres états : elle se charge indépendamment des autres, affiche un `Skeleton` pendant le chargement et un `Message` d'erreur si son appel échoue, sans bloquer le reste de la page. Les réponses sont mises en cache : en revenant au dashboard depuis une page de détail, les sections s'affichent immédiatement à partir du cache, puis Vue Query les rafraîchit en arrière-plan.

## Organisation du code

```
src/
├── main.ts         # Création de l'app : PrimeVue (preset ADEO, mode clair), VueQueryPlugin, router
├── App.vue         # Titre (lien vers /) et <RouterView />
├── router/         # Routes / (dashboard) et /products/:reference (détail, lazy)
├── theme/          # adeoPreset : preset Aura aux couleurs ADEO (tokens Mozaic)
├── api/            # Client HTTP unique (lit VITE_API_URL, lève ApiError) et types des réponses
├── composables/    # Un composable Vue Query par section, politique de retry
├── components/     # KpiBar, sections, ProductCards, ProductCard, ProductRating
├── views/          # DashboardView, ProductDetailView
├── utils/          # Fonctions pures : formatPrice, formatDate (fr-FR)
└── test-utils/     # Routeur mémoire pour les tests de composants
```

Les tests sont à côté du code, dans des dossiers `__tests__/` (`*.spec.ts`).

Règles du projet :

- **Composition API exclusivement** : tous les composants sont en `<script setup lang="ts">`, aucune Options API.
- **Pas de CSS sur mesure ni d'animations** : composants PrimeVue, mise en page en `style` inline et variables du thème (`var(--p-…)`).
- **PrimeVue 4.5 et `primeicons` 7** : dernières versions sous licence MIT. Ne pas monter en PrimeVue 5 / `primeicons` 8, passés sous licence commerciale PrimeUI.
- Seul `api/client.ts` appelle l'API ; les composants passent par les composables.

## Dépannage

| Symptôme                                              | Cause probable                                                         |
|-------------------------------------------------------|------------------------------------------------------------------------|
| Toutes les sections affichent « Impossible de charger… » | API non démarrée, ou `VITE_API_URL` absent / incorrect dans `frontend/.env` |
| Erreur CORS dans la console du navigateur             | L'origine du front ne correspond pas à `CORS_ORIGIN` du backend        |
| Catalogue vide alors que l'API répond                 | Base non seedée : voir « Réinitialiser la base » dans le [README du backend](../backend/README.md) |
