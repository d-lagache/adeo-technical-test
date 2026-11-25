# T02 — Épingler la version de Node

**Phase :** 0 — Socle du dépôt  
**Dépend de :** [T01](./T01-init-git.md)  
**Références :** docs/architecture.md §2

## Objectif

Garantir que tout le monde utilise Node 24 LTS.

## Fichiers concernés

- `.nvmrc`

## Étapes

1. Créer `.nvmrc` contenant `24`.

## Fait quand

- [ ] `nvm use` à la racine sélectionne Node 24.x.
- [ ] `node -v` affiche `v24.*`.
