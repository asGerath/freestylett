import "server-only";

import { createClient } from "@/lib/supabase/server";

import type {
  AdminLeagueFormOptions,
  AdminLeagueFormValues,
  AdminLeagueSummary,
} from "../types/league.types";

type AdminLeagueQueryRow = {
  id: string;
  name: string;
  short_name: string | null;
  slug: string;
  editorial_status: "draft" | "published" | "archived";
  updated_at: string;
  league_countries: Array<{
    is_primary: boolean;
    country: {
      name: string;
    } | null;
  }>;
};

type AdminLeagueFormRow = {
  id: string;
  name: string;
  short_name: string | null;
  slug: string;
  description: string;
  editorial_status: "draft" | "published" | "archived";
  logo_path: string | null;
  website_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  league_countries: Array<{
    country_id: string;
    is_primary: boolean;
  }>;
};

function getPrimaryCountry(row: AdminLeagueQueryRow) {
  const primaryCountry = row.league_countries.find(
    (leagueCountry) => leagueCountry.is_primary,
  );

  return (
    primaryCountry?.country?.name ??
    row.league_countries[0]?.country?.name ??
    "Sin país"
  );
}

function mapAdminLeague(
  row: AdminLeagueQueryRow,
): AdminLeagueSummary {
  return {
    id: row.id,
    name: row.name,
    shortName: row.short_name,
    slug: row.slug,
    country: getPrimaryCountry(row),
    editorialStatus: row.editorial_status,
    updatedAt: row.updated_at,
  };
}

export async function getAdminLeagues(): Promise<
  AdminLeagueSummary[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leagues")
    .select(`
      id,
      name,
      short_name,
      slug,
      editorial_status,
      updated_at,
      league_countries (
        is_primary,
        country:countries!league_countries_country_id_fkey (
          name
        )
      )
    `)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(
      `No fue posible consultar las ligas administrativas: ${error.message}`,
    );
  }

  return (data as unknown as AdminLeagueQueryRow[]).map(
    mapAdminLeague,
  );
}

export async function getAdminLeagueFormOptions(): Promise<
  AdminLeagueFormOptions
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

export async function getAdminLeagueById(
  id: string,
): Promise<AdminLeagueFormValues | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leagues")
    .select(`
      id,
      name,
      short_name,
      slug,
      description,
      editorial_status,
      logo_path,
      website_url,
      instagram_url,
      youtube_url,
      league_countries (
        country_id,
        is_primary
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No fue posible consultar la liga administrativa: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  const row = data as unknown as AdminLeagueFormRow;

  const primaryCountry =
    row.league_countries.find(
      (leagueCountry) => leagueCountry.is_primary,
    ) ?? row.league_countries[0];

  return {
    id: row.id,
    name: row.name,
    shortName: row.short_name ?? "",
    slug: row.slug,
    description: row.description,
    countryId: primaryCountry?.country_id ?? "",
    editorialStatus: row.editorial_status,
    logoPath: row.logo_path ?? "",
    websiteUrl: row.website_url ?? "",
    instagramUrl: row.instagram_url ?? "",
    youtubeUrl: row.youtube_url ?? "",
  };
}