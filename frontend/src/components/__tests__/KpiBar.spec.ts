import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'

import KpiBar from '../KpiBar.vue'
import { useStats } from '@/composables/useStats'

vi.mock('@/composables/useStats', () => ({ useStats: vi.fn<typeof useStats>() }))

function mockStats(state: { data?: unknown; isPending?: boolean; isError?: boolean }) {
  vi.mocked(useStats).mockReturnValue({
    data: ref(state.data),
    isPending: ref(state.isPending ?? false),
    isError: ref(state.isError ?? false),
  } as unknown as ReturnType<typeof useStats>)
}

const mountKpiBar = () => mount(KpiBar, { global: { plugins: [PrimeVue] } })

describe('KpiBar', () => {
  it('affiche le nombre total de produits et d’avis avec leur libellé', () => {
    mockStats({ data: { totalProducts: 250, totalReviews: 766 } })

    const wrapper = mountKpiBar()

    expect(wrapper.get('[data-testid="totalProducts"]').text()).toBe('250')
    expect(wrapper.get('[data-testid="totalReviews"]').text()).toBe('766')
    expect(wrapper.text()).toContain('Produits au catalogue')
    expect(wrapper.text()).toContain('Avis clients')
  })

  it('formate les grands nombres à la française', () => {
    mockStats({ data: { totalProducts: 1234, totalReviews: 1234567 } })

    const wrapper = mountKpiBar()

    // Intl insère une espace insécable étroite comme séparateur de milliers.
    const normalize = (text: string) => text.replace(/\s/g, ' ')
    expect(normalize(wrapper.get('[data-testid="totalProducts"]').text())).toBe('1 234')
    expect(normalize(wrapper.get('[data-testid="totalReviews"]').text())).toBe('1 234 567')
  })

  it('affiche des skeletons pendant le chargement', () => {
    mockStats({ isPending: true })

    const wrapper = mountKpiBar()

    expect(wrapper.findAll('.p-skeleton')).toHaveLength(2)
    expect(wrapper.find('[data-testid="totalProducts"]').exists()).toBe(false)
  })

  it('affiche un message d’erreur si l’API échoue', () => {
    mockStats({ isError: true })

    const wrapper = mountKpiBar()

    expect(wrapper.find('.p-message-error').exists()).toBe(true)
    expect(wrapper.find('.p-card').exists()).toBe(false)
  })
})
