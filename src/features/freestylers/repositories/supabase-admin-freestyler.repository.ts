import "server-only";

import { createClient } from "@/lib/supabase/server";

import type {
  AdminFreestylerFormOptions,
  AdminFreestylerFormValues,
  AdminFreestylerSummary,
  FreestylerEditorialStatus,
} from "../types/freestyler.types";

type AdminFreestylerQueryRow = {
  id: string;
  stage_name: string;
  real_name: string | null;
  aka: string | null;
  slug: string;
  city: string | null;
  editorial_status: FreestylerEditorialStatus;
  updated_at: string;
  country: {
    name: string;
  } | null;
};

function mapAdminFreestyler(
  row: AdminFreestylerQueryRow,
): AdminFreestylerSummary {
  return {
    id: row.id,
    stageName: row.stage_name,
    realName: row.real_name,
    aka: row.aka,
    slug: row.slug,
    country: row.country?.name ?? "Sin país",
    city: row.city,
    editorialStatus: row.editorial_status,
    updatedAt: row.updated_at,
  };
}

export async function getAdminFreestylers(): Promise<
  AdminFreestylerSummary[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("freestylers")
    .select(`
      id,
      stage_name,
      real_name,
      aka,
      slug,
      city,
      editorial_status,
      updated_at,
      country:countries!freestylers_country_id_fkey (
        name
      )
    `)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(
      `No fue posible consultar los freestylers administrativos: ${error.message}`,
    );
  }

  return (data as unknown as AdminFreestylerQueryRow[]).map(
    mapAdminFreestyler,
  );
}

export async function getAdminFreestylerFormOptions(): Promise<
  AdminFreestylerFormOptions
> {
  const supabase = await createClient();

  const { data: countries, error } = await supabase
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
    countries: countries ?? [],
  };
}

export async function getAdminFreestylerById(
  id: string,
): Promise<AdminFreestylerFormValues | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("freestylers")
    .select(`
      id,
      stage_name,
      real_name,
      aka,
      slug,
      bio,
      birth_date,
      country_id,
      city,
      photo_path,
      editorial_status,
      instagram_url,
      tiktok_url,
      youtube_url,
      twitch_url,
      x_url
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No fue posible consultar el freestyler administrativo: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    stageName: data.stage_name,
    realName: data.real_name ?? "",
    aka: data.aka ?? "",
    slug: data.slug,
    bio: data.bio ?? "",
    birthDate: data.birth_date ?? "",
    countryId: data.country_id ?? "",
    city: data.city ?? "",
    photoPath: data.photo_path ?? "",
    editorialStatus: data.editorial_status,
    instagramUrl: data.instagram_url ?? "",
    tiktokUrl: data.tiktok_url ?? "",
    youtubeUrl: data.youtube_url ?? "",
    twitchUrl: data.twitch_url ?? "",
    xUrl: data.x_url ?? "",
  };
}