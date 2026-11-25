# T36 — Carte produit unifiée

**Phase :** 3bis — Refonte UI  
**Dépend de :** [T28](./T28-most-appreciated-section.md), [T29](./T29-lowest-rated-section.md), [T34](./T34-adeo-theme.md)  
**Références :** docs/architecture.md §8.2

## Objectif

Utiliser une seule structure de carte produit (nom, référence, prix, note, nombre d'avis) dans toutes les sections du dashboard.

## Fichiers concernés

- `frontend/src/components/ProductRating.vue`
- `frontend/src/components/ProductCard.vue`
- `frontend/src/components/ProductCards.vue`
- `frontend/src/components/MostAppreciatedSection.vue`, `LowestRatedSection.vue`
- `frontend/src/components/__tests__/ProductRating.spec.ts`, `ProductCard.spec.ts`, `ProductCards.spec.ts`

## Étapes

1. `ProductRating` : `Rating` en lecture seule, suivi de « 4,2 / 5 (n avis) ». Sans avis, il affiche « Pas encore d'avis ».
2. `ProductCard` : nom en titre, puis « Réf. xxx », le prix (`formatPrice`) et `ProductRating`.
3. `ProductCards` : supprimer le slot `metric` et le générique. Le rendu passe en grille CSS `auto-fill` de `ProductCard`, et les états chargement / erreur / vide sont conservés.
4. Les deux sections de classement se limitent à brancher leur composable sur `ProductCards`. Le compteur d'avis positifs n'est plus affiché, et l'ordre reste celui de l'API.
5. Tests : `ProductRating` (cas avec et sans note), `ProductCard` (contenu), `ProductCards` (ordre et états).

## Fait quand

- [ ] Les deux classements affichent des cartes de structure identique.
