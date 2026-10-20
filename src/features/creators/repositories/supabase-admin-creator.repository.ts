import "server-only";

import { createClient } from "@/lib/supabase/server";

import type {
  AdminCreatorFormOptions,
  AdminCreatorFormValues,
  AdminCreatorSummary,
  CreatorEditorialStatus,
  CreatorType,
} from "../types/creator.types";

type AdminCreatorQueryRow = {
  id: string;
  name: string;
  slug: string;
  creator_type: CreatorType;
  handle: string | null;
  editorial_status: CreatorEditorialStatus;
  is_featured: boolean;
  updated_at: string;
  country: {
    name: string;
  } | null;
};

export async function getAdminCreators(): Promise<
  AdminCreatorSummary[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("creators")
    .select(`
      id,
      name,
      slug,
      creator_type,
      handle,
      editorial_status,
      is_featured,
      updated_at,
      country:countries!creators_country_id_fkey (
        name
      )
    `)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(
      `No fue posible consultar los creadores administrativos: ${error.message}`,
    );
  }

  return (data as unknown as AdminCreatorQueryRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    type: row.creator_type,
    handle: row.handle,
    country: row.country?.name ?? null,
    editorialStatus: row.editorial_status,
    isFeatured: row.is_featured,
    updatedAt: row.updated_at,
  }));
}

export async function getAdminCreatorFormOptions(): Promise<
  AdminCreatorFormOptions
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("countries")
    .select("id, name")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(
      `No fue posible consultar los países: ${error.message}`,
    );
  }

  return {
    countries: data ?? [],
  };
}

export async function getAdminCreatorById(
  id: string,
): Promise<AdminCreatorFormValues | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("creators")
    .select(`
      id,
      name,
      slug,
      creator_type,
      handle,
      description,
      country_id,
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
      editorial_status
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No fue posible consultar el creador administrativo: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    type: data.creator_type as CreatorType,
    handle: data.handle ?? "",
    description: data.description ?? "",
    countryId: data.country_id ?? "",
    city: data.city ?? "",
    imagePath: data.image_path ?? "",
    specialties: data.specialties.join(", "),
    isFeatured: data.is_featured,
    websiteUrl: data.website_url ?? "",
    youtubeUrl: data.youtube_url ?? "",
    instagramUrl: data.instagram_url ?? "",
    tiktokUrl: data.tiktok_url ?? "",
    twitchUrl: data.twitch_url ?? "",
    xUrl: data.x_url ?? "",
    sourceUrl: data.source_url ?? "",
    editorialStatus: data.editorial_status,
  };
}
