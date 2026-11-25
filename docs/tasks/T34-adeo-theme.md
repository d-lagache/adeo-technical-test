# T34 — Thème aux couleurs ADEO

**Phase :** 3bis — Refonte UI  
**Dépend de :** [T24](./T24-primevue.md)  
**Références :** docs/architecture.md §2, §8.1 ; design system ADEO Mozaic (`@mozaic-ds/tokens`, `build/adeo/css/root.css`)

## Objectif

Habiller le dashboard aux couleurs de l'enseigne ADEO. On passe par les tokens du thème PrimeVue, sans CSS sur mesure.

## Fichiers concernés

- `frontend/src/theme/adeoPreset.ts`
- `frontend/src/theme/__tests__/adeoPreset.spec.ts`
- `frontend/src/main.ts`
- `frontend/package.json` (`primeicons`)
- `CLAUDE.md`, `docs/architecture.md` (§2 stack, §8.1 règles, §10 justification)

## Étapes

1. Installer `primeicons` (MIT, pack d'icônes officiel de PrimeVue) et l'importer dans `main.ts`.
2. `adeoPreset.ts` : `definePreset(Aura, …)` avec une palette primaire teal issue des tokens Mozaic ADEO :
   - `100` `#d9f0f3`, `300` `#91d5db`, `400` `#009eac`, `500` `#00919f`, `600` `#007783`, `700` `#006974` et `950` `#082435` viennent de Mozaic ;
   - `50`, `200`, `800` et `900` sont interpolés.
3. `colorScheme.light.primary.color` = `{primary.600}` (`#007783`, la couleur d'accent Mozaic, contraste AA avec du texte blanc), `hoverColor` = `{primary.700}`.
4. `main.ts` : `preset: AdeoPreset`, `darkModeSelector: false` (le thème ADEO de Mozaic n'a qu'un mode clair).
5. Reformuler la règle « thème par défaut » dans `CLAUDE.md` et `architecture.md` §8.1 : preset Aura personnalisé via `definePreset`, toujours sans CSS sur mesure ni animations.
6. Test : le preset expose bien `#007783` en `primary.600`.

## Fait quand

- [x] Boutons, liens, étoiles et icônes du dashboard en teal ADEO.
- [x] Docs et `CLAUDE.md` alignés sur la nouvelle règle de thème.
