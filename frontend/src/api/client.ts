/** Erreur levée quand l'API répond avec un statut HTTP hors 2xx. */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, statusText: string, path: string) {
    super(`GET ${path} a échoué : ${status} ${statusText}`.trim())
    this.name = 'ApiError'
    this.status = status
  }
}

const baseUrl = import.meta.env.VITE_API_URL

/** Client HTTP unique du front : seul point d'accès à l'API. */
export const api = {
  /** `GET {VITE_API_URL}{path}` ; renvoie le corps JSON typé, lève une `ApiError` si `!response.ok`. */
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText, path)
    }

    return (await response.json()) as T
  },
}
