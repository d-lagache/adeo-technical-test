<script setup lang="ts">
import Rating from 'primevue/rating'

import ProductCards from './ProductCards.vue'
import { useLowestRated } from '@/composables/useLowestRated'

const { data: products, isPending, isError } = useLowestRated()
</script>

<template>
  <ProductCards
    title="Produits les moins bien notés"
    :products="products"
    :loading="isPending"
    :error="isError"
  >
    <template #metric="{ product }">
      <Rating :model-value="Math.round(product.averageNotation ?? 0)" readonly />
      <small> {{ product.averageNotation }} / 5 ({{ product.reviewsCount }} avis)</small>
    </template>
  </ProductCards>
</template>
