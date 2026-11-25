/** Formate une date ISO 8601 à la française, dans le fuseau du navigateur : `6 avril 2025`. */
export const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(isoDate))
