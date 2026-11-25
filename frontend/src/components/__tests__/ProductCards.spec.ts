import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'

import ProductCards from '../ProductCards.vue'
import type { ProductSummary } from '@/api/types'
import { createTestRouter } from '@/test-utils/router'

const product = (reference: string, averageNotation: number): ProductSummary => ({
  reference,
  name: `Produit ${reference}`,
  price: 10,
  currency: 'EUR',
  stock: 1,
  reviewsCount: 5,
  averageNotation,
})

// Ordre volontairement non trié : le composant doit conserver celui de l'API.
const products = [product('3', 2), product('1', 4), product('2', 3)]

const mountCards = (props: Record<string, unknown>) =>
  mount(ProductCards, {
    props: { title: 'Classement', ...props },
    global: { plugins: [PrimeVue, createTestRouter()] },
  })

describe('ProductCards', () => {
  it('rend une carte par produit, dans l’ordre reçu', () => {
    const wrapper = mountCards({ products })

    const cards = wrapper.findAll('[data-testid="product-card"]')
    expect(cards.map((card) => card.find('.p-card-title').text())).toEqual([
      'Produit 3',
      'Produit 1',
      'Produit 2',
    ])
  })

  it('affiche des skeletons pendant le chargement', () => {
    const wrapper = mountCards({ loading: true })

    expect(wrapper.findAll('.p-skeleton')).toHaveLength(5)
    expect(wrapper.find('[data-testid="product-card"]').exists()).toBe(false)
  })

  it('affiche un message d’erreur', () => {
    const wrapper = mountCards({ error: true, products })

    expect(wrapper.find('.p-message-error').exists()).toBe(true)
    expect(wrapper.find('[data-testid="product-card"]').exists()).toBe(false)
  })

  it('affiche un message quand la liste est vide', () => {
    const wrapper = mountCards({ products: [] })

    expect(wrapper.find('.p-message-info').exists()).toBe(true)
  })
})
