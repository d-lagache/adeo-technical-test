import { describe, expect, it } from 'vitest'

import { formatDate } from '../formatDate'

describe('formatDate', () => {
  it('formate une date ISO à la française', () => {
    // Midi UTC : le jour reste le même quel que soit le fuseau de la machine de test.
    expect(formatDate('2025-04-06T12:00:00.000Z')).toBe('6 avril 2025')
  })
})
