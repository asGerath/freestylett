// Modelo base de un freestyler.

export type FreestylerItem = {
  id: string;
  name: string;
  aka?: string;
  slug: string;
  country: string;
  city?: string;
  bio?: string;
  photoUrl?: string;
};