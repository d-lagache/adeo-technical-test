<script setup lang="ts">
import Message from 'primevue/message'
import Skeleton from 'primevue/skeleton'

import ProductCard from './ProductCard.vue'
import type { ProductSummary } from '@/api/types'

const {
  loading = false,
  error = false,
  skeletonCount = 5,
} = defineProps<{
  title: string
  products?: ProductSummary[]
  loading?: boolean
  error?: boolean
  /** Nombre de cartes fantômes affichées pendant le chargement. */
  skeletonCount?: number
}>()

const grid =
  'display: grid; grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr)); gap: 1rem'
</script>

<template>
  <section :aria-label="title">
    <h2>{{ title }}</h2>

    <Message v-if="error" severity="error">Impossible de charger « {{ title }} ».</Message>

    <div v-else-if="loading" :style="grid">
      <Skeleton v-for="n in skeletonCount" :key="n" height="10rem" />
    </div>

    <Message v-else-if="!products?.length" severity="info">Aucun produit à afficher.</Message>

    <div v-else :style="grid">
      <ProductCard v-for="product in products" :key="product.reference" :product="product" />
    </div>
  </section>
</template>
