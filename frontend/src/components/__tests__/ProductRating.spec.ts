import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'

import ProductRating from '../ProductRating.vue'

const mountRating = (props: { averageNotation: number | null; reviewsCount: number }) =>
  mount(ProductRating, { props, global: { plugins: [PrimeVue] } })

describe('ProductRating', () => {
  it('affiche les étoiles et la note à la française avec le nombre d’avis', () => {
    const wrapper = mountRating({ averageNotation: 4.23, reviewsCount: 12 })

    expect(wrapper.find('.p-rating').exists()).toBe(true)
    expect(wrapper.get('[data-testid="rating-label"]').text()).toBe('4,2 / 5 (12 avis)')
  })

  it('affiche « Pas encore d’avis » quand le produit n’a pas de note', () => {
    const wrapper = mountRating({ averageNotation: null, reviewsCount: 0 })

    expect(wrapper.text()).toBe("Pas encore d'avis")
    expect(wrapper.find('.p-rating').exists()).toBe(false)
  })
})
