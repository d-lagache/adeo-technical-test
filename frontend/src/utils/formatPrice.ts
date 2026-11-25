/** Formate un prix dans sa devise (code ISO 4217), à la française : `12,90 €`. */
export const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(price)
