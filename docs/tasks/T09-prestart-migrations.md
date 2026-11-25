# T09 — Migrations automatiques au démarrage

**Phase :** 1 — Backend : socle et base de données  
**Dépend de :** [T08](./T08-prisma-service.md)  
**Références :** docs/architecture.md §9

## Objectif

Démarrer l'API en une seule commande sur une base neuve.

## Fichiers concernés

- `backend/package.json`

## Étapes

1. Ajouter `"prestart:dev": "prisma migrate deploy && prisma generate"` (et équivalent pour `start`).
2. Ajouter `"postinstall": "prisma generate"`.

## Fait quand

- [ ] Après `docker compose down -v && docker compose up -d`, `npm run start:dev` crée les tables sans autre commande.
