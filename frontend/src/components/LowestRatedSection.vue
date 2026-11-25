<script setup lang="ts">
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
  />
</template>
