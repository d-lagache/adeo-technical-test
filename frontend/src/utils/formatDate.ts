/**
 * Formate une date ISO 8601 à la française : `6 avril 2025`. L'API renvoie les dates
 * d'avis sans fuseau, que `new Date` lit en heure locale : le jour affiché est celui de la source.
 */
export const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(isoDate))
