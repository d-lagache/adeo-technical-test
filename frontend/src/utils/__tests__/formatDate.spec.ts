import { describe, expect, it } from 'vitest'

import { formatDate } from '../formatDate'

describe('formatDate', () => {
  it('formate une date ISO à la française', () => {
    expect(formatDate('2025-04-06T02:09:10')).toBe('6 avril 2025')
  })

  it("garde le jour d'une date sans fuseau tardive, quel que soit le fuseau", () => {
    expect(formatDate('2025-04-06T23:30:00')).toBe('6 avril 2025')
  })
})
