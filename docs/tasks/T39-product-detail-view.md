# T39 — Page de détail produit

**Phase :** 3bis — Refonte UI  
**Dépend de :** [T19](./T19-product-detail.md), [T20](./T20-product-reviews.md), [T36](./T36-product-card.md), [T38](./T38-vue-router.md)  
**Références :** docs/architecture.md §6 (contrat d'API), §8

## Objectif

Afficher le détail d'un produit, sa note et la liste de tous ses avis.

## Fichiers concernés

- `frontend/src/api/types.ts` (`ProductDetail`, `Review`, `Author`)
- `frontend/src/composables/useProduct.ts`, `useProductReviews.ts`
- `frontend/src/utils/formatDate.ts`
- `frontend/src/views/ProductDetailView.vue`
- `frontend/src/views/__tests__/ProductDetailView.spec.ts`, `utils/__tests__/formatDate.spec.ts`
- `docs/architecture.md` (§3 arborescence, nouvel écran en §8)

## Étapes

1. Types alignés sur les DTO `product-detail`, `review` et `author` du backend.
2. `useProduct(reference)` → `GET /products/:reference` ; `useProductReviews(reference)` → `GET /products/:reference/reviews`. Ce sont deux requêtes indépendantes, chacune avec ses propres états loading/error.
3. `ProductDetailView` :
   - un lien de retour ;
   - une carte produit : nom, référence, prix, stock, description, `ProductRating` ;
   - une liste des avis : note, commentaire, auteur, type (Professionnel / Amateur), date `fr-FR`.
4. États : un skeleton pendant le chargement, « Produit introuvable » sur 404, une erreur générique sinon, et « Aucun avis » quand la liste est vide.
5. Tests : rendu du détail et des avis (composables mockés), cas 404 et liste vide, et `formatDate`.

## Fait quand

- [ ] `/products/<reference>` affiche le produit et autant d'avis que `reviewsCount`.
- [ ] `/products/inconnu` affiche « Produit introuvable ».
