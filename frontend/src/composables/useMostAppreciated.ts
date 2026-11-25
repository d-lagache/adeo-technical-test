import { useQuery } from '@tanstack/vue-query'

import { api } from '@/api/client'
import type { MostAppreciatedProduct } from '@/api/types'

/** Les `limit` produits ayant le plus d'avis positifs (`GET /products/most-appreciated`). */
export function useMostAppreciated(limit = 5) {
  return useQuery({
    queryKey: ['products', 'most-appreciated', limit],
    queryFn: () => api.get<MostAppreciatedProduct[]>(`/products/most-appreciated?limit=${limit}`),
  })
}
