import { afterEach, describe, expect, it, vi } from 'vitest'

import { api, ApiError } from '../client'
import type { Stats } from '../types'

describe('api.get', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renvoie le corps JSON quand la réponse est ok', async () => {
    const stats: Stats = { totalProducts: 250, totalReviews: 766 }
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(Response.json(stats))
    vi.stubGlobal('fetch', fetchMock)

    await expect(api.get<Stats>('/stats')).resolves.toEqual(stats)
    expect(fetchMock).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_URL}/stats`,
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    )
  })

  it('lève une ApiError sur une réponse 500', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(
          new Response('{"statusCode":500}', { status: 500, statusText: 'Internal Server Error' }),
        ),
    )

    const error = await api.get('/stats').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 500 })
  })
})
