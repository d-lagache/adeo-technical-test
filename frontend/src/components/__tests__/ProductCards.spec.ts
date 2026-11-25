import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'

import ProductCards from '../ProductCards.vue'
import type { MostAppreciatedProduct } from '@/api/types'

const product = (reference: string, positiveReviewsCount: number): MostAppreciatedProduct => ({
  reference,
  name: `Produit ${reference}`,
  price: 10,
  currency: 'EUR',
  stock: 1,
  reviewsCount: 5,
  averageNotation: 4,
  positiveReviewsCount,
})

const products = [product('1', 5), product('2', 4), product('3', 3)]

const mountCards = (props: Record<string, unknown>) =>
  mount(ProductCards, {
    props: { title: 'Classement', ...props },
    slots: {
      metric:
        '<template #metric="{ product }">{{ product.positiveReviewsCount }} positifs</template>',
    },
    global: { plugins: [PrimeVue] },
  })

describe('ProductCards', () => {
  it('rend une carte par produit, dans l’ordre reçu, avec la métrique du slot', () => {
    const wrapper = mountCards({ products })

    const cards = wrapper.findAll('[data-testid="product-card"]')
    expect(cards).toHaveLength(3)
    expect(cards.map((card) => card.text())).toEqual([
      expect.stringContaining('5 positifs'),
      expect.stringContaining('4 positifs'),
      expect.stringContaining('3 positifs'),
    ])
    expect(cards[0]?.text()).toContain('Produit 1')
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
