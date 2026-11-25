<script setup lang="ts">
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import Message from 'primevue/message'
import Rating from 'primevue/rating'
import Skeleton from 'primevue/skeleton'
import Tag from 'primevue/tag'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { ApiError } from '@/api/client'
import type { AuthorType } from '@/api/types'
import ProductRating from '@/components/ProductRating.vue'
import { useProduct } from '@/composables/useProduct'
import { useProductReviews } from '@/composables/useProductReviews'
import { formatDate } from '@/utils/formatDate'
import { formatPrice } from '@/utils/formatPrice'

const { reference } = defineProps<{ reference: string }>()

// Deux requêtes indépendantes, chacune avec ses propres états loading/error.
const { data: product, isPending, isError, error } = useProduct(() => reference)
const {
  data: reviews,
  isPending: reviewsPending,
  isError: reviewsError,
} = useProductReviews(() => reference)

const notFound = computed(() => error.value instanceof ApiError && error.value.status === 404)

const authorTypeLabels: Record<AuthorType, string> = {
  professional: 'Professionnel',
  amateur: 'Amateur',
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 1.5rem">
    <RouterLink to="/" style="color: var(--p-primary-color)">
      <i class="pi pi-arrow-left" aria-hidden="true" /> Retour au dashboard
    </RouterLink>

    <Message v-if="notFound" severity="warn">
      Produit introuvable : aucune référence « {{ reference }} » dans le catalogue.
    </Message>

    <template v-else>
      <section aria-label="Produit">
        <Message v-if="isError" severity="error">Impossible de charger le produit.</Message>

        <Skeleton v-else-if="isPending" height="14rem" />

        <Card v-else-if="product" data-testid="product-detail">
          <template #title>{{ product.name }}</template>
          <template #subtitle>Réf. {{ product.reference }}</template>
          <template #content>
            <div style="display: flex; flex-direction: column; gap: 0.75rem">
              <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap">
                <strong style="font-size: 1.5rem" data-testid="product-price">
                  {{ formatPrice(product.price, product.currency) }}
                </strong>
                <Tag
                  :severity="product.stock > 0 ? 'success' : 'danger'"
                  :value="product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'"
                />
              </div>
              <ProductRating
                :average-notation="product.averageNotation"
                :reviews-count="product.reviewsCount"
              />
              <p style="margin: 0">{{ product.description }}</p>
            </div>
          </template>
        </Card>
      </section>

      <section aria-label="Avis clients">
        <h2>Avis clients</h2>

        <Message v-if="reviewsError" severity="error">Impossible de charger les avis.</Message>

        <div v-else-if="reviewsPending" style="display: flex; flex-direction: column; gap: 1rem">
          <Skeleton v-for="n in 3" :key="n" height="5rem" />
        </div>

        <Message v-else-if="!reviews?.length" severity="info">Aucun avis</Message>

        <Card v-else>
          <template #content>
            <template v-for="(review, index) in reviews" :key="index">
              <Divider v-if="index > 0" />
              <article data-testid="review">
                <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap">
                  <Rating :model-value="review.notation" readonly />
                  <strong>{{ review.author.firstName }} {{ review.author.lastName }}</strong>
                  <Tag
                    :severity="review.author.type === 'professional' ? 'info' : 'secondary'"
                    :value="authorTypeLabels[review.author.type]"
                  />
                  <small style="color: var(--p-text-muted-color)">
                    {{ formatDate(review.date) }}
                  </small>
                </div>
                <p style="margin: 0.5rem 0 0">{{ review.comment }}</p>
              </article>
            </template>
          </template>
        </Card>
      </section>
    </template>
  </div>
</template>
