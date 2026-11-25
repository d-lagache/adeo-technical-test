<script setup lang="ts">
const { reference } = defineProps<{ reference: string }>()
</script>

<template>
  <p>Produit {{ reference }}</p>
</template>
