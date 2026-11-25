import { ApiError } from '@/api/client'

/**
 * Politique de retry des requêtes sur une ressource identifiée : une 404 est définitive
 * (référence inconnue), on ne la rejoue pas ; les autres erreurs gardent les 3 essais par défaut.
 */
export const retryUnlessNotFound = (failureCount: number, error: Error) =>
  !(error instanceof ApiError && error.status === 404) && failureCount < 3
