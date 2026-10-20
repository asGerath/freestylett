import "server-only";

import { createClient } from "@/lib/supabase/server";

import type { CreatorRepository } from "./creator.repository";
import type {
  CreatorItem,
  CreatorType,
} from "../types/creator.types";

const CREATOR_SELECT = `
  id,
  name,
  slug,
  creator_type,
  handle,
  description,
  city,
  image_path,
  specialties,
  is_featured,
  website_url,
  youtube_url,
  instagram_url,
  tiktok_url,
  twitch_url,
  x_url,
  source_url,
  country:countries!creators_country_id_fkey (
    name
  )
`;

type CreatorQueryRow = {
  id: string;
  name: string;
  slug: string;
  creator_type: CreatorType;
  handle: string | null;
  description: string | null;
  city: string | null;
  image_path: string | null;
  specialties: string[];
  is_featured: boolean;
  website_url: string | null;
  youtube_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  twitch_url: string | null;
  x_url: string | null;
  source_url: string | null;
  country: {
    name: string;
  } | null;
};

function getImageUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  imagePath: string | null,
) {
  if (!imagePath) {
    return undefined;
  }

  return supabase.storage
    .from("public-media")
    .getPublicUrl(imagePath).data.publicUrl;
}

function mapCreator(
  row: CreatorQueryRow,
  supabase: Awaited<ReturnType<typeof createClient>>,
): CreatorItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    type: row.creator_type,
    handle: row.handle ?? undefined,
    description: row.description ?? undefined,
    country: row.country?.name,
    city: row.city ?? undefined,
    imageUrl: getImageUrl(supabase, row.image_path),
    specialties: row.specialties,
    isFeatured: row.is_featured,
    links: {
      website: row.website_url ?? undefined,
      youtube: row.youtube_url ?? undefined,
      instagram: row.instagram_url ?? undefined,
      tiktok: row.tiktok_url ?? undefined,
      twitch: row.twitch_url ?? undefined,
      x: row.x_url ?? undefined,
    },
    sourceUrl: row.source_url ?? undefined,
  };
}

async function getAll(): Promise<CreatorItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("creators")
    .select(CREATOR_SELECT)
    .eq("editorial_status", "published")
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(
      `No fue posible consultar los creadores: ${error.message}`,
    );
  }

  return (data as unknown as CreatorQueryRow[]).map((creator) =>
    mapCreator(creator, supabase),
  );
}

async function getBySlug(slug: string): Promise<CreatorItem | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("creators")
    .select(CREATOR_SELECT)
    .eq("slug", slug)
    .eq("editorial_status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(
      `No fue posible consultar el creador: ${error.message}`,
    );
  }

  return data
    ? mapCreator(data as unknown as CreatorQueryRow, supabase)
    : null;
}

export const supabaseCreatorRepository: CreatorRepository = {
  getAll,
  getBySlug,
};
