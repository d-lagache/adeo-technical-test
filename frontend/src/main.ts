import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'

const app = createApp(App)

app.use(PrimeVue, { theme: { preset: Aura } })
app.use(VueQueryPlugin)

app.mount('#app')
