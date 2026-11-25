import { useQuery } from '@tanstack/vue-query'

import { api } from '@/api/client'
import type { Stats } from '@/api/types'

/** Indicateurs globaux du bandeau KPI (`GET /stats`). */
export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => api.get<Stats>('/stats'),
  })
}
