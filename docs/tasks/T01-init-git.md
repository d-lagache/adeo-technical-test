# T01 — Initialiser le dépôt git

**Phase :** 0 — Socle du dépôt  
**Dépend de :** —  
**Références :** README.md (Rules)

## Objectif

Versionner le projet dès le départ : le README impose que le code soit poussé sur un dépôt git.

## Fichiers concernés

- `.gitignore`

## Étapes

1. `git init` à la racine (branche `main`).
2. Créer un `.gitignore` racine : `node_modules/`, `dist/`, `.env`, `coverage/`, `.idea/`, `.DS_Store`.
3. Premier commit avec `README.md`, `CLAUDE.md`, `data/`, `docs/`.

## Fait quand

- [ ] `git status` est propre après le premier commit.
- [ ] `git check-ignore .env node_modules` confirme que les deux sont ignorés.
