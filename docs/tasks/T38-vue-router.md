# T38 — Routing

**Phase :** 3bis — Refonte UI  
**Dépend de :** [T31](./T31-dashboard-view.md)  
**Références :** docs/architecture.md §2, §3

## Objectif

Introduire `vue-router` pour pouvoir ouvrir une page de détail produit adressable par URL.

## Fichiers concernés

- `frontend/package.json` (`vue-router`)
- `frontend/src/router/index.ts`
- `frontend/src/main.ts`, `frontend/src/App.vue`
- `frontend/src/components/ProductCard.vue`
- `frontend/src/__tests__/App.spec.ts`, `components/__tests__/ProductCard.spec.ts`
- `docs/architecture.md` (stack, retrait de « sans router » et justification)

## Étapes

1. Installer `vue-router`. Routes avec `createWebHistory()` : `/` (`dashboard`) et `/products/:reference` (`product-detail`, chargée en lazy, `props: true`). Remonter en haut de page à chaque navigation.
2. `main.ts` : `app.use(router)`. `App.vue` : titre cliquable vers `/` et `<RouterView />`.
3. `ProductCard` devient un `RouterLink` vers `product-detail`.
4. Tests avec un routeur mémoire : `App` rend la route courante, et le lien de la carte pointe vers `/products/<reference>`.
5. Docs : vue-router dans la stack, avec sa justification (URL partageable, bouton retour du navigateur).

## Fait quand

- [x] Un clic sur une carte change l'URL en `/products/<reference>`.
