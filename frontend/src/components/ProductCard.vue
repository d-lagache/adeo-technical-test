<script setup lang="ts">
import Card from 'primevue/card'

import ProductRating from './ProductRating.vue'
import type { ProductSummary } from '@/api/types'
import { formatPrice } from '@/utils/formatPrice'

const { product } = defineProps<{ product: ProductSummary }>()
</script>

<template>
  <Card data-testid="product-card" style="height: 100%">
    <template #title>{{ product.name }}</template>
    <template #subtitle>Réf. {{ product.reference }}</template>
    <template #content>
      <div style="display: flex; flex-direction: column; gap: 0.5rem">
        <strong data-testid="product-price">{{
          formatPrice(product.price, product.currency)
        }}</strong>
        <ProductRating
          :average-notation="product.averageNotation"
          :reviews-count="product.reviewsCount"
        />
      </div>
    </template>
  </Card>
</template>
