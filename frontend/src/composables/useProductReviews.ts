import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

import { api } from '@/api/client'
import type { Review } from '@/api/types'
import { retryUnlessNotFound } from './retry'

/** Avis d'un produit, auteur inclus, du plus récent au plus ancien (`GET /products/:reference/reviews`). */
export function useProductReviews(reference: MaybeRefOrGetter<string>) {
  // `computed` : la clé (donc la requête) suit la référence quand la route change.
  const key = computed(() => toValue(reference))

  return useQuery({
    queryKey: ['products', key, 'reviews'],
    queryFn: () => api.get<Review[]>(`/products/${encodeURIComponent(key.value)}/reviews`),
    retry: retryUnlessNotFound,
  })
}
