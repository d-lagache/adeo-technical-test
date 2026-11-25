import { describe, expect, it } from 'vitest'

import { AdeoPreset } from '../adeoPreset'

describe('AdeoPreset', () => {
  it('expose la couleur d’accent ADEO en primary.600, utilisée comme couleur primaire', () => {
    const semantic = AdeoPreset.semantic as {
      primary: Record<number, string>
      colorScheme: { light: { primary: { color: string } } }
    }

    expect(semantic.primary[600]).toBe('#007783')
    expect(semantic.colorScheme.light.primary.color).toBe('{primary.600}')
  })
})
