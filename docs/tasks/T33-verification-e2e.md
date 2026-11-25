# T33 — Vérification de bout en bout

**Phase :** 4 — Finalisation  
**Dépend de :** [T32](./T32-docs-update.md)  
**Références :** docs/architecture.md §9

## Objectif

S'assurer que le projet fonctionne depuis un clone neuf, en suivant uniquement la documentation.

## Fichiers concernés

- Aucun (tâche de vérification / publication)

## Étapes

1. `docker compose down -v && docker compose up -d`.
2. Backend : `npm ci`, `cp .env.example .env`, `npm run start:dev`.
3. Frontend : `npm ci`, `cp .env.example .env`, `npm run dev`.
4. `npm test` et `npm run lint` dans les deux applications.

## Fait quand

- [ ] Dashboard complet sur base neuve, sans étape manuelle non documentée.
- [ ] Tous les tests et lints passent.
