import { describe, expect, it } from 'vitest'

import { formatCount, formatNotation } from '../formatNumber'

describe('formatCount', () => {
  it('sépare les milliers à la française', () => {
    expect(formatCount(1234567).replace(/\s/g, ' ')).toBe('1 234 567')
  })
})

describe('formatNotation', () => {
  it('garde une décimale au plus, avec une virgule', () => {
    expect(formatNotation(4.33)).toBe('4,3')
    expect(formatNotation(4)).toBe('4')
  })
})
