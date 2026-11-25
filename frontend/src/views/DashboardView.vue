<script setup lang="ts">
import KpiBar from '@/components/KpiBar.vue'
import LowestRatedSection from '@/components/LowestRatedSection.vue'
import MostAppreciatedSection from '@/components/MostAppreciatedSection.vue'
import ProductTable from '@/components/ProductTable.vue'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 2rem">
    <KpiBar />
    <MostAppreciatedSection />
    <LowestRatedSection />
    <ProductTable />
  </div>
</template>
