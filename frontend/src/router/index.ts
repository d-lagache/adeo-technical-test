import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import DashboardView from '@/views/DashboardView.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'dashboard', component: DashboardView },
  {
    path: '/products/:reference',
    name: 'product-detail',
    // Chargée à la demande : le dashboard n'embarque pas le code de la page de détail.
    component: () => import('@/views/ProductDetailView.vue'),
    props: true,
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Chaque navigation repart du haut de la page (le bouton retour restaure la position).
  scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { top: 0 },
})
