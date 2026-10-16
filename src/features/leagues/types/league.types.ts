// Modelo público utilizado por listados, detalles y previews.
export type LeagueItem = {
  id: string;
  name: string;
  slug: string;
  country: string;
  description: string;
  logoUrl?: string;
};

export type LeagueEditorialStatus =
  | "draft"
  | "published"
  | "archived";

export type AdminLeagueSummary = {
  id: string;
  name: string;
  shortName: string | null;
  slug: string;
  country: string;
  editorialStatus: LeagueEditorialStatus;
  updatedAt: string;
};

export type AdminLeagueFormOptions = {
  countries: Array<{
    id: string;
    name: string;
  }>;
};

export type AdminLeagueFormValues = {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  description: string;
  countryId: string;
  editorialStatus: LeagueEditorialStatus;
  logoPath: string;
  websiteUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
};