<script setup lang="ts">
import Card from 'primevue/card'
import Message from 'primevue/message'
import Skeleton from 'primevue/skeleton'

import { useStats } from '@/composables/useStats'
import { formatCount } from '@/utils/formatNumber'

const { data: stats, isPending, isError } = useStats()

const kpis = [
  { label: 'Produits au catalogue', key: 'totalProducts', icon: 'pi pi-box' },
  { label: 'Avis clients', key: 'totalReviews', icon: 'pi pi-comments' },
] as const
</script>

<template>
  <section aria-label="Indicateurs clés">
    <Message v-if="isError" severity="error">Impossible de charger les indicateurs.</Message>
    <div v-else style="display: flex; gap: 1rem; flex-wrap: wrap">
      <Card v-for="kpi in kpis" :key="kpi.key" style="flex: 1 1 14rem">
        <template #content>
          <div style="display: flex; align-items: center; gap: 1rem">
            <i
              :class="kpi.icon"
              aria-hidden="true"
              style="font-size: 2rem; color: var(--p-primary-color)"
            />
            <div>
              <Skeleton v-if="isPending" width="5rem" height="2.5rem" />
              <div v-else :data-testid="kpi.key" style="font-size: 2.5rem; font-weight: 700">
                {{ stats ? formatCount(stats[kpi.key]) : '' }}
              </div>
              <div style="color: var(--p-text-muted-color)">{{ kpi.label }}</div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </section>
</template>
