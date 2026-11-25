<script setup lang="ts">
import Tag from 'primevue/tag'

import ProductCards from './ProductCards.vue'
import { useMostAppreciated } from '@/composables/useMostAppreciated'

const { data: products, isPending, isError } = useMostAppreciated()
</script>

<template>
  <ProductCards
    title="Produits les plus appréciés"
    :products="products"
    :loading="isPending"
    :error="isError"
  >
    <template #metric="{ product }">
      <Tag severity="success" :value="`${product.positiveReviewsCount} avis positifs`" />
      <small> sur {{ product.reviewsCount }} avis</small>
    </template>
  </ProductCards>
</template>
