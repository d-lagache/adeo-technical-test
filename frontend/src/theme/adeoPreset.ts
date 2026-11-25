import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

/**
 * Preset Aura aux couleurs ADEO : palette primaire teal issue des tokens du design system
 * Mozaic (`@mozaic-ds/tokens`, thème `adeo`). Les nuances 50, 200, 800 et 900, absentes de
 * Mozaic, sont interpolées entre leurs voisines.
 */
export const AdeoPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#ecf8f9', // interpolé
      100: '#d9f0f3',
      200: '#b5e3e7', // interpolé
      300: '#91d5db',
      400: '#009eac',
      500: '#00919f',
      600: '#007783',
      700: '#006974',
      800: '#034d5b', // interpolé
      900: '#063242', // interpolé
      950: '#082435',
    },
    colorScheme: {
      light: {
        primary: {
          // Couleur d'accent Mozaic : contraste AA avec un texte blanc.
          color: '{primary.600}',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}',
        },
      },
    },
  },
})
