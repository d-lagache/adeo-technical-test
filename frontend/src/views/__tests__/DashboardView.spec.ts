import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import DashboardView from '../DashboardView.vue'

describe('DashboardView', () => {
  it('compose les 4 sections dans l’ordre : KPI, classements, catalogue', () => {
    const wrapper = shallowMount(DashboardView)

    const sections = [...wrapper.element.children].map((el) => el.tagName.toLowerCase())

    expect(sections).toEqual([
      'kpi-bar-stub',
      'most-appreciated-section-stub',
      'lowest-rated-section-stub',
      'catalogue-section-stub',
    ])
  })
})
