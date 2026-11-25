# T32 — Mettre à jour la documentation de conception

**Phase :** 4 — Finalisation  
**Dépend de :** [T31](./T31-dashboard-view.md)  
**Références :** CLAUDE.md

## Objectif

Les docs servent de support à l'entretien : elles doivent refléter le code réel.

## Fichiers concernés

- `docs/architecture.md`
- `docs/database-schema.md`
- `CLAUDE.md`

## Étapes

1. Retirer l'encart « À confirmer » du §9 (script `prestart:dev` en place).
2. Reporter tout écart d'implémentation (types, noms d'index, choix de requête SQL, versions).
3. Mettre à jour l'« État actuel » de `CLAUDE.md`.

## Fait quand

- [ ] Relecture : aucune contradiction entre docs et code.
