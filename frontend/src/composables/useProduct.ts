import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

import { api } from '@/api/client'
import type { ProductDetail } from '@/api/types'
import { retryUnlessNotFound } from './retry'

/** Détail d'un produit, sans ses avis (`GET /products/:reference`). */
export function useProduct(reference: MaybeRefOrGetter<string>) {
  // `computed` : la clé (donc la requête) suit la référence quand la route change.
  const key = computed(() => toValue(reference))

  return useQuery({
    queryKey: ['products', key],
    queryFn: () => api.get<ProductDetail>(`/products/${encodeURIComponent(key.value)}`),
    retry: retryUnlessNotFound,
  })
}
