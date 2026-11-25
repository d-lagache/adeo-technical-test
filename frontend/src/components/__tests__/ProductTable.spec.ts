import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'

import ProductTable from '../ProductTable.vue'
import { useProducts } from '@/composables/useProducts'
import type { ProductSummary } from '@/api/types'

vi.mock('@/composables/useProducts', () => ({ useProducts: vi.fn<typeof useProducts>() }))

function mockProducts(state: { data?: ProductSummary[]; isPending?: boolean; isError?: boolean }) {
  vi.mocked(useProducts).mockReturnValue({
    data: ref(state.data),
    isPending: ref(state.isPending ?? false),
    isError: ref(state.isError ?? false),
  } as unknown as ReturnType<typeof useProducts>)
}

const products: ProductSummary[] = [
  {
    reference: '59033201',
    name: 'Perceuse',
    price: 129.9,
    currency: 'EUR',
    stock: 12,
    reviewsCount: 3,
    averageNotation: 4.33,
  },
  {
    reference: '59033202',
    name: 'Marteau',
    price: 15,
    currency: 'EUR',
    stock: 0,
    reviewsCount: 0,
    averageNotation: null,
  },
]

const mountTable = () => mount(ProductTable, { global: { plugins: [PrimeVue] } })

describe('ProductTable', () => {
  it('affiche une ligne par produit avec le prix formaté', () => {
    mockProducts({ data: products })

    const rows = mountTable().findAll('tbody tr')

    expect(rows).toHaveLength(2)
    const cells = rows[0]!.findAll('td').map((td) => td.text().replace(/\s/g, ' '))
    expect(cells).toEqual(['59033201', 'Perceuse', '129,90 €', '12', '3', '4.33'])
  })

  it('affiche un tiret pour un produit sans avis', () => {
    mockProducts({ data: products })

    const cells = mountTable().findAll('tbody tr')[1]!.findAll('td')

    expect(cells[cells.length - 1]!.text()).toBe('—')
  })

  it('affiche un message d’erreur si l’API échoue', () => {
    mockProducts({ isError: true })

    const wrapper = mountTable()

    expect(wrapper.find('.p-message-error').exists()).toBe(true)
    expect(wrapper.find('.p-datatable').exists()).toBe(false)
  })
})
