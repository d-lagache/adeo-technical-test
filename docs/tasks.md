# Suivi des tâches

Une tâche = un commit. Le détail de chaque tâche est dans [`tasks/`](./tasks/). **Le statut fait foi ici** : le mettre à jour à chaque tâche terminée.

Légende : ⬜ à faire · 🔄 en cours · ✅ terminé

**Avancement : 27 / 32**

## Phase 0 — Socle du dépôt

| Statut | Tâche | Dépend de |
|--------|-------|-----------|
| ✅ | [T01 — Initialiser le dépôt git](./tasks/T01-init-git.md) | — |
| ✅ | [T02 — Épingler la version de Node](./tasks/T02-nvmrc.md) | T01 |
| ✅ | [T03 — PostgreSQL 18 avec Docker Compose](./tasks/T03-docker-compose.md) | T01 |

## Phase 1 — Backend : socle et base de données

| Statut | Tâche | Dépend de |
|--------|-------|-----------|
| ✅ | [T04 — Scaffolder l'application NestJS](./tasks/T04-scaffold-nestjs.md) | T02 |
| ✅ | [T05 — Configuration et validation de l'environnement](./tasks/T05-config-module.md) | T04 |
| ✅ | [T06 — Schéma Prisma](./tasks/T06-prisma-schema.md) | T05 |
| ✅ | [T07 — Migration initiale et contraintes CHECK](./tasks/T07-migration-initiale.md) | T03, T06 |
| ✅ | [T08 — PrismaModule et PrismaService](./tasks/T08-prisma-service.md) | T07 |
| ✅ | [T09 — Migrations automatiques au démarrage](./tasks/T09-prestart-migrations.md) | T08 |
| ✅ | [T10 — Seed : transformation du JSON (fonction pure)](./tasks/T10-seed-mapping.md) | T06 |
| ✅ | [T11 — Seed : insertion au démarrage](./tasks/T11-seed-service.md) | T09, T10 |

## Phase 2 — Backend : API

| Statut | Tâche | Dépend de |
|--------|-------|-----------|
| ✅ | [T12 — Configuration transverse de l'API](./tasks/T12-main-bootstrap.md) | T05 |
| ✅ | [T13 — Swagger UI et OpenAPI](./tasks/T13-swagger-setup.md) | T12 |
| ✅ | [T14 — Endpoint GET /stats](./tasks/T14-stats-endpoint.md) | T11, T13 |
| ✅ | [T15 — Endpoint GET /products](./tasks/T15-products-list.md) | T11, T13 |
| ✅ | [T16 — DTO de query `limit`](./tasks/T16-limit-query-dto.md) | T12 |
| ✅ | [T17 — Endpoint GET /products/most-appreciated](./tasks/T17-most-appreciated.md) | T15, T16 |
| ✅ | [T18 — Endpoint GET /products/lowest-rated](./tasks/T18-lowest-rated.md) | T15, T16 |
| ✅ | [T19 — Endpoint GET /products/:reference](./tasks/T19-product-detail.md) | T15 |
| ✅ | [T20 — Endpoint GET /products/:reference/reviews](./tasks/T20-product-reviews.md) | T19 |
| ✅ | [T21 — Passe de finition Swagger](./tasks/T21-swagger-polish.md) | T14, T17, T18, T20 |
| ✅ | [T22 — README du backend](./tasks/T22-backend-readme.md) | T21 |

## Phase 3 — Frontend (bonus)

| Statut | Tâche | Dépend de |
|--------|-------|-----------|
| ✅ | [T23 — Scaffolder l'application Vue 3](./tasks/T23-scaffold-vue.md) | T02 |
| ✅ | [T24 — Intégrer PrimeVue](./tasks/T24-primevue.md) | T23 |
| ✅ | [T25 — Intégrer TanStack Vue Query](./tasks/T25-vue-query.md) | T23 |
| ✅ | [T26 — Client HTTP et types](./tasks/T26-api-client.md) | T23 |
| ✅ | [T27 — Bandeau KPI](./tasks/T27-kpi-bar.md) | T14, T24, T25, T26 |
| ✅ | [T28 — Section « Produits les plus appréciés »](./tasks/T28-most-appreciated-section.md) | T17, T24, T25, T26 |
| ✅ | [T29 — Section « Produits les moins bien notés »](./tasks/T29-lowest-rated-section.md) | T18, T28 |
| ✅ | [T30 — Catalogue complet](./tasks/T30-catalogue-table.md) | T15, T24, T25, T26 |
| ⬜ | [T31 — Assemblage du dashboard](./tasks/T31-dashboard-view.md) | T27, T28, T29, T30 |

## Phase 4 — Finalisation

| Statut | Tâche | Dépend de |
|--------|-------|-----------|
| ⬜ | [T32 — Mettre à jour la documentation de conception](./tasks/T32-docs-update.md) | T31 |
