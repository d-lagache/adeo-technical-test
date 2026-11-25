<script setup lang="ts">
import CatalogueSection from '@/components/CatalogueSection.vue'
import KpiBar from '@/components/KpiBar.vue'
import LowestRatedSection from '@/components/LowestRatedSection.vue'
import MostAppreciatedSection from '@/components/MostAppreciatedSection.vue'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 2rem">
    <KpiBar />
    <MostAppreciatedSection />
    <LowestRatedSection />
    <CatalogueSection />
  </div>
</template>
