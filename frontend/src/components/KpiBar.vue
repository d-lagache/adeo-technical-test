<script setup lang="ts">
import Card from 'primevue/card'
import Message from 'primevue/message'
import Skeleton from 'primevue/skeleton'

import { useStats } from '@/composables/useStats'

const { data: stats, isPending, isError } = useStats()

const kpis = [
  { label: 'Produits', key: 'totalProducts' },
  { label: 'Avis', key: 'totalReviews' },
] as const
</script>

<template>
  <section aria-label="Indicateurs clés">
    <Message v-if="isError" severity="error">Impossible de charger les indicateurs.</Message>
    <div v-else style="display: flex; gap: 1rem; flex-wrap: wrap">
      <Card v-for="kpi in kpis" :key="kpi.key" style="flex: 1 1 12rem">
        <template #title>
          <Skeleton v-if="isPending" width="4rem" height="2rem" />
          <span v-else :data-testid="kpi.key">{{ stats?.[kpi.key] }}</span>
        </template>
        <template #subtitle>{{ kpi.label }}</template>
      </Card>
    </div>
  </section>
</template>
