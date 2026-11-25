import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router'

import App from '../App.vue'
import { routes } from '@/router'

const Dashboard = defineComponent({ render: () => h('p', 'dashboard') })
const Detail = defineComponent({
  props: { reference: { type: String, required: true } },
  setup: (props) => () => h('p', `détail ${props.reference}`),
})

const mountApp = async (path: string) => {
  const router = createRouter({
    history: createMemoryHistory(),
    // Vraies routes de l'application, vues remplacées par des stubs (pas d'appel API).
    routes: routes.map((route): RouteRecordRaw => ({
      path: route.path,
      name: route.name,
      props: true,
      component: route.name === 'dashboard' ? Dashboard : Detail,
    })),
  })
  await router.push(path)
  const wrapper = mount(App, { global: { plugins: [router] } })
  await flushPromises()
  return wrapper
}

describe('App', () => {
  it('affiche le titre, lien vers l’accueil', async () => {
    const wrapper = await mountApp('/')

    const title = wrapper.get('main h1 a')
    expect(title.text()).toBe('Dashboard catalogue')
    expect(title.attributes('href')).toBe('/')
  })

  it('rend la route courante', async () => {
    expect((await mountApp('/')).text()).toContain('dashboard')
    expect((await mountApp('/products/59033201')).text()).toContain('détail 59033201')
  })
})
