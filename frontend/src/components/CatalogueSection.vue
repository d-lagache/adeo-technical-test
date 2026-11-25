<script setup lang="ts">
import ProductCards from './ProductCards.vue'
import { useProducts } from '@/composables/useProducts'

// Les 250 produits sont affichés d'un coup, sans pagination (choix assumé, cf. docs/architecture.md).
const { data: products, isPending, isError } = useProducts()
</script>

<template>
  <ProductCards
    title="Catalogue complet"
    :products="products"
    :loading="isPending"
    :error="isError"
    :skeleton-count="10"
  />
</template>
