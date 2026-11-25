/** Formate un entier à la française, avec séparateur de milliers : `1 234`. */
export const formatCount = (value: number) => new Intl.NumberFormat('fr-FR').format(value)

/** Formate une note à la française, à une décimale au plus : `4,2`. */
export const formatNotation = (value: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(value)
