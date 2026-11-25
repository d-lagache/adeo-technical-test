import { useQuery } from '@tanstack/vue-query'

import { api } from '@/api/client'
import type { ProductSummary } from '@/api/types'

/** Catalogue complet en version résumée, sans pagination (`GET /products`). */
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => api.get<ProductSummary[]>('/products'),
  })
}
