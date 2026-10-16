// Modelo público utilizado por listados, detalles y previews.
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

export type FreestylerEditorialStatus =
  | "draft"
  | "published"
  | "archived";

export type AdminFreestylerSummary = {
  id: string;
  stageName: string;
  realName: string | null;
  aka: string | null;
  slug: string;
  country: string;
  city: string | null;
  editorialStatus: FreestylerEditorialStatus;
  updatedAt: string;
};

export type AdminFreestylerFormOptions = {
  countries: Array<{
    id: string;
    name: string;
  }>;
};

export type AdminFreestylerFormValues = {
  id: string;
  stageName: string;
  realName: string;
  aka: string;
  slug: string;
  bio: string;
  birthDate: string;
  countryId: string;
  city: string;
  photoPath: string;
  editorialStatus: FreestylerEditorialStatus;
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  twitchUrl: string;
  xUrl: string;
};