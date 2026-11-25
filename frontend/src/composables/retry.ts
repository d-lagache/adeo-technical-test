import { ApiError } from '@/api/client'

/**
 * Politique de retry des requêtes sur une ressource identifiée : une 404 est définitive
 * (référence inconnue), on ne la rejoue pas ; les autres erreurs gardent le défaut de Vue Query
 * (3 nouvelles tentatives, soit 4 appels au plus).
 */
export const retryUnlessNotFound = (failureCount: number, error: Error) =>
  !(error instanceof ApiError && error.status === 404) && failureCount < 3
