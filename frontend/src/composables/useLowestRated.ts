import { useQuery } from '@tanstack/vue-query'

import { api } from '@/api/client'
import type { ProductSummary } from '@/api/types'

/** Jusqu'à `limit` produits de moyenne < 3, du moins bien noté au mieux noté (`GET /products/lowest-rated`). */
export function useLowestRated(limit = 5) {
  return useQuery({
    queryKey: ['products', 'lowest-rated', limit],
    queryFn: () => api.get<ProductSummary[]>(`/products/lowest-rated?limit=${limit}`),
  })
}
