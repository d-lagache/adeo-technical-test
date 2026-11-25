<script setup lang="ts">
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Message from 'primevue/message'

import { useProducts } from '@/composables/useProducts'
import { formatPrice } from '@/utils/formatPrice'

const { data: products, isPending, isError } = useProducts()
</script>

<template>
  <section aria-label="Catalogue complet">
    <h2>Catalogue complet</h2>

    <Message v-if="isError" severity="error">Impossible de charger le catalogue.</Message>

    <DataTable v-else :value="products" :loading="isPending" data-key="reference" striped-rows>
      <template #empty>Aucun produit à afficher.</template>

      <Column field="reference" header="Référence" />
      <Column field="name" header="Nom" />
      <Column field="price" header="Prix">
        <template #body="{ data }">{{ formatPrice(data.price, data.currency) }}</template>
      </Column>
      <Column field="stock" header="Stock" />
      <Column field="reviewsCount" header="Avis" />
      <Column field="averageNotation" header="Note moyenne">
        <template #body="{ data }">{{ data.averageNotation ?? '—' }}</template>
      </Column>
    </DataTable>
  </section>
</template>
