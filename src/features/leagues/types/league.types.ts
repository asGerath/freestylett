// Modelo base de una liga.
// Más adelante crecerá con rankings, temporadas, eventos y participantes.

export type LeagueItem = {
  id: string;
  name: string;
  slug: string;
  country: string;
  description: string;
  logoUrl?: string;
};