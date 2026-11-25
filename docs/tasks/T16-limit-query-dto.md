# T16 — DTO de query `limit`

**Phase :** 2 — Backend : API  
**Dépend de :** [T12](./T12-main-bootstrap.md)  
**Références :** docs/architecture.md §5.3

## Objectif

Valider le paramètre `limit` des classements.

## Fichiers concernés

- `backend/src/products/dto/limit-query.dto.ts`

## Étapes

1. `@Type(() => Number) @IsInt() @Min(1) @Max(50) @IsOptional() limit = 5`.
2. `@ApiPropertyOptional({ minimum: 1, maximum: 50, default: 5 })`.

## Fait quand

- [ ] Utilisé en T17/T18 : `limit=0`, `limit=51`, `limit=abc` → 400.
