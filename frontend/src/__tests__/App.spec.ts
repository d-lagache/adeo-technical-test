import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('affiche le dashboard', () => {
    const wrapper = mount(App, { global: { stubs: { DashboardView: true } } })

    expect(wrapper.find('main h1').text()).toBe('Dashboard catalogue')
    expect(wrapper.findComponent({ name: 'DashboardView' }).exists()).toBe(true)
  })
})
