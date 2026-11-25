<script setup lang="ts">
import Rating from 'primevue/rating'

const { averageNotation, reviewsCount } = defineProps<{
  /** Note moyenne de 1 à 5, `null` si le produit n'a aucun avis. */
  averageNotation: number | null
  reviewsCount: number
}>()

const formatNotation = (value: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(value)
</script>

<template>
  <div v-if="averageNotation === null" style="color: var(--p-text-muted-color)">
    Pas encore d'avis
  </div>
  <div v-else style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap">
    <!-- Rating n'affiche que des étoiles entières : la valeur exacte suit en texte. -->
    <Rating :model-value="Math.round(averageNotation)" readonly />
    <small data-testid="rating-label">
      {{ formatNotation(averageNotation) }} / 5 ({{ reviewsCount }} avis)
    </small>
  </div>
</template>
