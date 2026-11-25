<script setup lang="ts">
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
  />
</template>
