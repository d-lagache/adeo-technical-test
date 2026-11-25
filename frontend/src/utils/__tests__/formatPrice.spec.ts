import { describe, expect, it } from 'vitest'

import { formatPrice } from '../formatPrice'

// Intl insère des espaces insécables (milliers, avant le symbole) : on les normalise.
const normalize = (text: string) => text.replace(/\s/g, ' ')

describe('formatPrice', () => {
  it('formate un prix en euros à la française', () => {
    expect(normalize(formatPrice(1234.5, 'EUR'))).toBe('1 234,50 €')
  })

  it('utilise la devise reçue', () => {
    expect(normalize(formatPrice(12, 'USD'))).toBe('12,00 $US')
  })
})
