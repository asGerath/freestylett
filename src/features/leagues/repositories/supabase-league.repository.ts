import "server-only";

import { createClient } from "@/lib/supabase/server";

import type { LeagueRepository } from "./league.repository";
import type { LeagueItem } from "../types/league.types";

const LEAGUE_SELECT = `
  id,
  name,
  slug,
  description,
  logo_path,
  league_countries (
    is_primary,
    country:countries!league_countries_country_id_fkey (
      name
    )
  )
`;

type LeagueQueryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_path: string | null;
  league_countries: Array<{
    is_primary: boolean;
    country: {
      name: string;
    } | null;
  }>;
};

function getPrimaryCountry(row: LeagueQueryRow) {
  const primaryCountry = row.league_countries.find(
    (leagueCountry) => leagueCountry.is_primary,
  );

  return (
    primaryCountry?.country?.name ??
    row.league_countries[0]?.country?.name ??
    "Internacional"
  );
}

function getLogoUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  logoPath: string | null,
) {
  if (!logoPath) {
    return undefined;
  }

  return supabase.storage
    .from("public-media")
    .getPublicUrl(logoPath).data.publicUrl;
}

function mapLeague(
  row: LeagueQueryRow,
  supabase: Awaited<ReturnType<typeof createClient>>,
): LeagueItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    country: getPrimaryCountry(row),
    description: row.description,
    logoUrl: getLogoUrl(supabase, row.logo_path),
  };
}

async function getAll(): Promise<LeagueItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leagues")
    .select(LEAGUE_SELECT)
    .eq("editorial_status", "published")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`No fue posible consultar las ligas: ${error.message}`);
  }

  return (data as unknown as LeagueQueryRow[]).map((league) =>
    mapLeague(league, supabase),
  );
}

async function getBySlug(slug: string): Promise<LeagueItem | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leagues")
    .select(LEAGUE_SELECT)
    .eq("slug", slug)
    .eq("editorial_status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(`No fue posible consultar la liga: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapLeague(data as unknown as LeagueQueryRow, supabase);
}

async function getFeatured(limit = 3): Promise<LeagueItem[]> {
  const leagues = await getAll();

  return leagues.slice(0, limit);
}

export const supabaseLeagueRepository: LeagueRepository = {
  getAll,
  getBySlug,
  getFeatured,
};