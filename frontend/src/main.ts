import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import { VueQueryPlugin } from '@tanstack/vue-query'
import 'primeicons/primeicons.css'

import App from './App.vue'
import { AdeoPreset } from './theme/adeoPreset'

const app = createApp(App)

// Le thème ADEO de Mozaic n'existe qu'en mode clair : pas de mode sombre.
app.use(PrimeVue, { theme: { preset: AdeoPreset, options: { darkModeSelector: false } } })
app.use(VueQueryPlugin)

app.mount('#app')
