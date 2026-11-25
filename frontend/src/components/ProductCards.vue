<script setup lang="ts" generic="T extends ProductSummary">
import Card from 'primevue/card'
import Message from 'primevue/message'
import Skeleton from 'primevue/skeleton'

import type { ProductSummary } from '@/api/types'

const {
  loading = false,
  error = false,
  skeletonCount = 5,
} = defineProps<{
  title: string
  products?: T[]
  loading?: boolean
  error?: boolean
  /** Nombre de cartes fantômes affichées pendant le chargement. */
  skeletonCount?: number
}>()

defineSlots<{
  /** Métrique mise en avant sur chaque carte (nombre d'avis positifs, note moyenne…). */
  metric(props: { product: T }): unknown
}>()

const formatPrice = (product: ProductSummary) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: product.currency }).format(
    product.price,
  )
</script>

<template>
  <section :aria-label="title">
    <h2>{{ title }}</h2>

    <Message v-if="error" severity="error">Impossible de charger « {{ title }} ».</Message>

    <div v-else-if="loading" style="display: flex; gap: 1rem; flex-wrap: wrap">
      <Skeleton v-for="n in skeletonCount" :key="n" width="14rem" height="10rem" />
    </div>

    <Message v-else-if="!products?.length" severity="info">Aucun produit à afficher.</Message>

    <div v-else style="display: flex; gap: 1rem; flex-wrap: wrap">
      <Card
        v-for="product in products"
        :key="product.reference"
        data-testid="product-card"
        style="flex: 1 1 14rem"
      >
        <template #title>{{ product.name }}</template>
        <template #subtitle>Réf. {{ product.reference }} · {{ formatPrice(product) }}</template>
        <template #content>
          <slot name="metric" :product="product" />
        </template>
      </Card>
    </div>
  </section>
</template>
