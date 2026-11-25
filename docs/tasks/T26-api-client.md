# T26 — Client HTTP et types

**Phase :** 3 — Frontend (bonus)  
**Dépend de :** [T23](./T23-scaffold-vue.md)  
**Références :** docs/architecture.md §6, §8.1

## Objectif

Centraliser les appels à l'API et typer ses réponses.

## Fichiers concernés

- `frontend/src/api/client.ts`
- `frontend/src/api/types.ts`
- `frontend/.env.example`
- `frontend/src/env.d.ts`

## Étapes

1. `VITE_API_URL=http://localhost:3000/api/v1` dans `.env.example`, typé dans `env.d.ts`.
2. `api.get<T>(path)` basé sur `fetch`, qui lève une erreur si `!response.ok`.
3. Types `Stats`, `ProductSummary`, `MostAppreciatedProduct` alignés sur les DTO.
4. Test Vitest : erreur levée sur réponse 500 (fetch mocké).

## Fait quand

- [ ] `npx vitest run src/api` passe.
- [ ] `npm run type-check` passe.
