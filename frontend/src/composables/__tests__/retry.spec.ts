import { describe, expect, it } from 'vitest'

import { ApiError } from '@/api/client'
import { retryUnlessNotFound } from '../retry'

describe('retryUnlessNotFound', () => {
  it('ne rejoue jamais une 404', () => {
    expect(retryUnlessNotFound(0, new ApiError(404, 'Not Found', '/products/inconnu'))).toBe(false)
  })

  it('rejoue les autres erreurs HTTP 3 fois au plus', () => {
    const error = new ApiError(500, 'Internal Server Error', '/products/59033201')

    expect([0, 1, 2, 3].map((failureCount) => retryUnlessNotFound(failureCount, error))).toEqual([
      true,
      true,
      true,
      false,
    ])
  })

  it('rejoue une erreur réseau', () => {
    expect(retryUnlessNotFound(0, new TypeError('Failed to fetch'))).toBe(true)
  })
})
