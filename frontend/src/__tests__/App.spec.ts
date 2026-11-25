import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts', () => {
    const wrapper = mount(App)
    expect(wrapper.find('main').exists()).toBe(true)
  })
})
