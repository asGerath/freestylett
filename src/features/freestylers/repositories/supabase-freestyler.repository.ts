import "server-only";

import { createClient } from "@/lib/supabase/server";

import type { FreestylerRepository } from "./freestyler.repository";
import type { FreestylerItem } from "../types/freestyler.types";

const FREESTYLER_SELECT = `
  id,
  stage_name,
  aka,
  slug,
  bio,
  city,
  photo_path,
  country:countries!freestylers_country_id_fkey (
    name
  )
`;

type FreestylerQueryRow = {
  id: string;
  stage_name: string;
  aka: string | null;
  slug: string;
  bio: string | null;
  city: string | null;
  photo_path: string | null;
  country: {
    name: string;
  } | null;
};

function getPhotoUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  photoPath: string | null,
) {
  if (!photoPath) {
    return undefined;
  }

  return supabase.storage
    .from("public-media")
    .getPublicUrl(photoPath).data.publicUrl;
}

function mapFreestyler(
  row: FreestylerQueryRow,
  supabase: Awaited<ReturnType<typeof createClient>>,
): FreestylerItem {
  return {
    id: row.id,
    name: row.stage_name,
    aka: row.aka ?? undefined,
    slug: row.slug,
    country: row.country?.name ?? "País no definido",
    city: row.city ?? undefined,
    bio: row.bio ?? undefined,
    photoUrl: getPhotoUrl(supabase, row.photo_path),
  };
}

async function getAll(): Promise<FreestylerItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("freestylers")
    .select(FREESTYLER_SELECT)
    .eq("editorial_status", "published")
    .order("stage_name", { ascending: true });

  if (error) {
    throw new Error(
      `No fue posible consultar los freestylers: ${error.message}`,
    );
  }

  return (data as unknown as FreestylerQueryRow[]).map((freestyler) =>
    mapFreestyler(freestyler, supabase),
  );
}

async function getBySlug(slug: string): Promise<FreestylerItem | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("freestylers")
    .select(FREESTYLER_SELECT)
    .eq("slug", slug)
    .eq("editorial_status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(
      `No fue posible consultar el freestyler: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return mapFreestyler(
    data as unknown as FreestylerQueryRow,
    supabase,
  );
}

async function getFeatured(limit = 3): Promise<FreestylerItem[]> {
  const freestylers = await getAll();

  return freestylers.slice(0, limit);
}

export const supabaseFreestylerRepository: FreestylerRepository = {
  getAll,
  getBySlug,
  getFeatured,
};