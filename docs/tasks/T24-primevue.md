# T24 — Intégrer PrimeVue

**Phase :** 3 — Frontend (bonus)  
**Dépend de :** [T23](./T23-scaffold-vue.md)  
**Références :** docs/architecture.md §8.1

## Objectif

Disposer des composants UI avec le thème par défaut.

## Fichiers concernés

- `frontend/src/main.ts`
- `frontend/package.json`

## Étapes

1. Installer `primevue@^4.5` et `@primeuix/themes@^2.0` (la v5 n'est plus sous licence MIT, cf. architecture.md §2).
2. `app.use(PrimeVue, { theme: { preset: Aura } })`.
3. Aucun CSS sur mesure.

## Fait quand

- [x] Un `<Button label="test" />` temporaire s'affiche stylé, puis est retiré.
