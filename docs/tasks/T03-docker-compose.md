# T03 — PostgreSQL 18 avec Docker Compose

**Phase :** 0 — Socle du dépôt  
**Dépend de :** [T01](./T01-init-git.md)  
**Références :** docs/architecture.md §4.1, §4.2

## Objectif

Lancer une base PostgreSQL locale dont la version est explicitement tracée dans le dépôt.

## Fichiers concernés

- `docker-compose.yml`

## Étapes

1. Service `db` : image `postgres:18-alpine`, port `5432:5432`.
2. Variables `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`.
3. Volume nommé monté sur le répertoire de données (attention : le chemin `PGDATA` a changé en v18, vérifier la doc de l'image).
4. Healthcheck `pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB`.

## Fait quand

- [ ] `docker compose up -d` puis `docker compose ps` → conteneur `healthy`.
- [ ] `docker compose exec db psql -U <user> -d <db> -c 'select version()'` affiche PostgreSQL 18.
- [ ] Les données survivent à `docker compose down` / `up`.
