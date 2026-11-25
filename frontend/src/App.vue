<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <main style="padding: 1rem">
    <h1>
      <RouterLink :to="{ name: 'dashboard' }" style="color: inherit; text-decoration: none"
        >Dashboard catalogue</RouterLink
      >
    </h1>
    <RouterView />
  </main>
</template>
