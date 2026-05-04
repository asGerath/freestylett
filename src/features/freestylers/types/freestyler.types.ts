// Modelo base de un freestyler.
// Más adelante crecerá con stats, ligas, ranking, etc.

export type FreestylerItem = {
  id: string;
  name: string;
  aka?: string;
  slug: string;
  country: string;
  city?: string;
  photoUrl?: string;
};