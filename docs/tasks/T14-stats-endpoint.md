# T14 — Endpoint GET /stats

**Phase :** 2 — Backend : API  
**Dépend de :** [T11](./T11-seed-service.md), [T13](./T13-swagger-setup.md)  
**Références :** docs/architecture.md §6, §8.2

## Objectif

Fournir les KPI du dashboard.

## Fichiers concernés

- `backend/src/stats/stats.module.ts`
- `backend/src/stats/stats.controller.ts`
- `backend/src/stats/stats.service.ts`
- `backend/src/stats/dto/stats.dto.ts`
- `backend/src/stats/stats.service.spec.ts`

## Étapes

1. `StatsDto { totalProducts, totalReviews }`.
2. Service : `product.count()` et `review.count()` en parallèle.
3. Controller `@Get()` avec `@ApiTags('stats')` et `@ApiOkResponse({ type: StatsDto })`.
4. Test unitaire avec Prisma mocké.

## Fait quand

- [ ] `curl localhost:3000/api/v1/stats` → `{"totalProducts":250,"totalReviews":766}`.
- [ ] `npm test` passe.
