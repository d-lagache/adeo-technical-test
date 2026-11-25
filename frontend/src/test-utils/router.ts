import { createMemoryHistory, createRouter } from 'vue-router'

import { routes } from '@/router'

/** Routeur en mémoire avec les vraies routes de l'application, pour les tests de composants. */
export const createTestRouter = () => createRouter({ history: createMemoryHistory(), routes })
