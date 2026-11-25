import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'

import ProductCard from '../ProductCard.vue'
import type { ProductSummary } from '@/api/types'

const product: ProductSummary = {
  reference: '59033201',
  name: 'Perceuse',
  price: 129.9,
  currency: 'EUR',
  stock: 12,
  reviewsCount: 3,
  averageNotation: 4.33,
}

const mountCard = () => mount(ProductCard, { props: { product }, global: { plugins: [PrimeVue] } })

describe('ProductCard', () => {
  it('affiche le nom, la référence, le prix formaté et la note', () => {
    const wrapper = mountCard()

    expect(wrapper.find('.p-card-title').text()).toBe('Perceuse')
    expect(wrapper.find('.p-card-subtitle').text()).toBe('Réf. 59033201')
    expect(wrapper.get('[data-testid="product-price"]').text().replace(/\s/g, ' ')).toBe('129,90 €')
    expect(wrapper.get('[data-testid="rating-label"]').text()).toBe('4,3 / 5 (3 avis)')
  })
})
