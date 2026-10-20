export type CreatorType = "person" | "channel" | "media";

export type CreatorEditorialStatus =
  | "draft"
  | "published"
  | "archived";

export type CreatorLinks = {
  website?: string;
  youtube?: string;
  instagram?: string;
  tiktok?: string;
  twitch?: string;
  x?: string;
};

export type CreatorItem = {
  id: string;
  name: string;
  slug: string;
  type: CreatorType;
  handle?: string;
  description?: string;
  country?: string;
  city?: string;
  imageUrl?: string;
  specialties: string[];
  isFeatured: boolean;
  links: CreatorLinks;
  sourceUrl?: string;
};

export type AdminCreatorSummary = {
  id: string;
  name: string;
  slug: string;
  type: CreatorType;
  handle: string | null;
  country: string | null;
  editorialStatus: CreatorEditorialStatus;
  isFeatured: boolean;
  updatedAt: string;
};

export type AdminCreatorFormOptions = {
  countries: Array<{
    id: string;
    name: string;
  }>;
};

export type AdminCreatorFormValues = {
  id: string;
  name: string;
  slug: string;
  type: CreatorType;
  handle: string;
  description: string;
  countryId: string;
  city: string;
  imagePath: string;
  specialties: string;
  isFeatured: boolean;
  websiteUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  twitchUrl: string;
  xUrl: string;
  sourceUrl: string;
  editorialStatus: CreatorEditorialStatus;
};
