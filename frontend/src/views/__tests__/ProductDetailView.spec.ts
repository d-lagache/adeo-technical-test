import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'

import ProductDetailView from '../ProductDetailView.vue'
import { ApiError } from '@/api/client'
import type { ProductDetail, Review } from '@/api/types'
import { useProduct } from '@/composables/useProduct'
import { useProductReviews } from '@/composables/useProductReviews'
import { createTestRouter } from '@/test-utils/router'

vi.mock('@/composables/useProduct', () => ({ useProduct: vi.fn<typeof useProduct>() }))
vi.mock('@/composables/useProductReviews', () => ({
  useProductReviews: vi.fn<typeof useProductReviews>(),
}))

interface QueryState<T> {
  data?: T
  isPending?: boolean
  isError?: boolean
  error?: Error | null
}

const queryResult = <T>(state: QueryState<T>) => ({
  data: ref(state.data),
  isPending: ref(state.isPending ?? false),
  isError: ref(state.isError ?? false),
  error: ref(state.error ?? null),
})

function mockProduct(state: QueryState<ProductDetail>) {
  vi.mocked(useProduct).mockReturnValue(
    queryResult(state) as unknown as ReturnType<typeof useProduct>,
  )
}

function mockReviews(state: QueryState<Review[]>) {
  vi.mocked(useProductReviews).mockReturnValue(
    queryResult(state) as unknown as ReturnType<typeof useProductReviews>,
  )
}

const product: ProductDetail = {
  reference: '59033201',
  name: 'Perceuse',
  price: 129.9,
  currency: 'EUR',
  stock: 12,
  reviewsCount: 2,
  averageNotation: 4.5,
  description: 'Perceuse sans fil 18 V.',
}

const reviews: Review[] = [
  {
    notation: 5,
    comment: 'Très pratique.',
    date: '2025-04-06T12:00:00.000Z',
    author: { firstName: 'Poha', lastName: 'Kuxero', type: 'professional' },
  },
  {
    notation: 4,
    comment: 'Bon rapport qualité-prix.',
    date: '2025-03-01T12:00:00.000Z',
    author: { firstName: 'Lina', lastName: 'Moreau', type: 'amateur' },
  },
]

const mountView = (reference = '59033201') =>
  mount(ProductDetailView, {
    props: { reference },
    global: { plugins: [PrimeVue, createTestRouter()] },
  })

describe('ProductDetailView', () => {
  beforeEach(() => {
    mockProduct({ data: product })
    mockReviews({ data: reviews })
  })

  it('interroge les composables avec la référence de la route', () => {
    mountView()

    const getter = vi.mocked(useProduct).mock.calls[0]![0] as () => string
    expect(getter()).toBe('59033201')
  })

  it('affiche le détail du produit', () => {
    const detail = mountView().get('[data-testid="product-detail"]')

    expect(detail.find('.p-card-title').text()).toBe('Perceuse')
    expect(detail.text()).toContain('Réf. 59033201')
    expect(detail.get('[data-testid="product-price"]').text().replace(/\s/g, ' ')).toBe('129,90 €')
    expect(detail.text()).toContain('12 en stock')
    expect(detail.text()).toContain('Perceuse sans fil 18 V.')
    expect(detail.text()).toContain('4,5 / 5 (2 avis)')
  })

  it('affiche un avis par élément avec note, auteur, type et date', () => {
    const items = mountView().findAll('[data-testid="review"]')

    expect(items).toHaveLength(product.reviewsCount)
    const first = items[0]!
    expect(first.text()).toContain('Poha Kuxero')
    expect(first.text()).toContain('Professionnel')
    expect(first.text()).toContain('6 avril 2025')
    expect(first.text()).toContain('Très pratique.')
    expect(first.find('.p-rating').exists()).toBe(true)
    expect(items[1]!.text()).toContain('Amateur')
  })

  it('affiche « Produit introuvable » sur une 404', () => {
    mockProduct({ isError: true, error: new ApiError(404, 'Not Found', '/products/inconnu') })
    mockReviews({
      isError: true,
      error: new ApiError(404, 'Not Found', '/products/inconnu/reviews'),
    })

    const wrapper = mountView('inconnu')

    expect(wrapper.text()).toContain('Produit introuvable')
    expect(wrapper.find('[data-testid="product-detail"]').exists()).toBe(false)
    expect(wrapper.find('.p-message-error').exists()).toBe(false)
  })

  it('affiche une erreur générique sur une autre erreur', () => {
    mockProduct({ isError: true, error: new ApiError(500, 'Internal Server Error', '/products/x') })

    const wrapper = mountView()

    expect(wrapper.text()).toContain('Impossible de charger le produit.')
    expect(wrapper.text()).not.toContain('Produit introuvable')
  })

  it('affiche « Aucun avis » quand la liste est vide', () => {
    mockReviews({ data: [] })

    const wrapper = mountView()

    expect(wrapper.find('.p-message-info').text()).toContain('Aucun avis')
    expect(wrapper.find('[data-testid="review"]').exists()).toBe(false)
  })

  it('affiche des skeletons pendant le chargement', () => {
    mockProduct({ isPending: true })
    mockReviews({ isPending: true })

    const wrapper = mountView()

    expect(wrapper.findAll('.p-skeleton')).toHaveLength(4)
  })
})
