"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  canAccessEditorialPanel,
  getCurrentUser,
} from "@/features/auth/services/auth.service";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type EditorialStatus =
  Database["public"]["Enums"]["editorial_status"];

const editorialStatuses: EditorialStatus[] = [
  "draft",
  "published",
  "archived",
];

function getRequiredString(
  formData: FormData,
  field: string,
) {
  const value = formData.get(field);

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.trim();
}

function getOptionalString(
  formData: FormData,
  field: string,
) {
  const value = formData.get(field);

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.trim();
}

function redirectWithError(
  path: string,
  message: string,
): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

async function requireEditorialUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!canAccessEditorialPanel(user)) {
    redirect("/dashboard");
  }

  return user;
}

function getLeagueFormValues(
  formData: FormData,
  errorPath: string,
) {
  const name = getRequiredString(formData, "name");
  const slug = getRequiredString(formData, "slug");
  const description = getRequiredString(
    formData,
    "description",
  );
  const countryId = getRequiredString(
    formData,
    "countryId",
  );
  const editorialStatus = getRequiredString(
    formData,
    "editorialStatus",
  );

  if (
    !name ||
    !slug ||
    !description ||
    !countryId ||
    !editorialStatus
  ) {
    redirectWithError(
      errorPath,
      "Completa todos los campos obligatorios.",
    );
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    redirectWithError(
      errorPath,
      "El slug solo puede contener letras minúsculas, números y guiones.",
    );
  }

  if (
    !editorialStatuses.includes(
      editorialStatus as EditorialStatus,
    )
  ) {
    redirectWithError(
      errorPath,
      "El estado editorial no es válido.",
    );
  }

  return {
    league: {
      name,
      short_name: getOptionalString(
        formData,
        "shortName",
      ),
      slug,
      description,
      editorial_status:
        editorialStatus as EditorialStatus,
      logo_path: getOptionalString(formData, "logoPath"),
      website_url: getOptionalString(
        formData,
        "websiteUrl",
      ),
      instagram_url: getOptionalString(
        formData,
        "instagramUrl",
      ),
      youtube_url: getOptionalString(
        formData,
        "youtubeUrl",
      ),
    },
    countryId,
  };
}

function revalidateLeaguePaths(
  previousSlug?: string,
  nextSlug?: string,
) {
  revalidatePath("/");
  revalidatePath("/ligas");
  revalidatePath("/admin");
  revalidatePath("/admin/ligas");

  if (previousSlug) {
    revalidatePath(`/ligas/${previousSlug}`);
  }

  if (nextSlug) {
    revalidatePath(`/ligas/${nextSlug}`);
  }
}

export async function createLeague(formData: FormData) {
  const user = await requireEditorialUser();
  const errorPath = "/admin/ligas/nueva";
  const values = getLeagueFormValues(
    formData,
    errorPath,
  );
  const supabase = await createClient();

  const { data: league, error } = await supabase
    .from("leagues")
    .insert({
      ...values.league,
      created_by: user.id,
      updated_by: user.id,
      published_at:
        values.league.editorial_status === "published"
          ? new Date().toISOString()
          : null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      redirectWithError(
        errorPath,
        "Ya existe una liga con ese slug.",
      );
    }

    redirectWithError(
      errorPath,
      `No fue posible crear la liga: ${error.message}`,
    );
  }

  const { error: countryError } = await supabase
    .from("league_countries")
    .insert({
      league_id: league.id,
      country_id: values.countryId,
      is_primary: true,
    });

  if (countryError) {
    await supabase
      .from("leagues")
      .delete()
      .eq("id", league.id);

    redirectWithError(
      errorPath,
      `No fue posible asignar el país: ${countryError.message}`,
    );
  }

  revalidateLeaguePaths(undefined, values.league.slug);

  redirect("/admin/ligas?created=1");
}

export async function updateLeague(
  leagueId: string,
  formData: FormData,
) {
  const user = await requireEditorialUser();
  const errorPath = `/admin/ligas/${leagueId}/editar`;
  const values = getLeagueFormValues(
    formData,
    errorPath,
  );
  const supabase = await createClient();

  const { data: currentLeague, error: queryError } =
    await supabase
      .from("leagues")
      .select("slug, published_at")
      .eq("id", leagueId)
      .maybeSingle();

  if (queryError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar la liga: ${queryError.message}`,
    );
  }

  if (!currentLeague) {
    redirectWithError(
      errorPath,
      "La liga ya no existe.",
    );
  }

  const { error } = await supabase
    .from("leagues")
    .update({
      ...values.league,
      updated_by: user.id,
      published_at:
        values.league.editorial_status === "published"
          ? currentLeague.published_at ??
            new Date().toISOString()
          : currentLeague.published_at,
    })
    .eq("id", leagueId);

  if (error) {
    if (error.code === "23505") {
      redirectWithError(
        errorPath,
        "Ya existe otra liga con ese slug.",
      );
    }

    redirectWithError(
      errorPath,
      `No fue posible actualizar la liga: ${error.message}`,
    );
  }

  const { error: resetCountryError } = await supabase
    .from("league_countries")
    .update({ is_primary: false })
    .eq("league_id", leagueId);

  if (resetCountryError) {
    redirectWithError(
      errorPath,
      `No fue posible actualizar el país principal: ${resetCountryError.message}`,
    );
  }

  const { error: countryError } = await supabase
    .from("league_countries")
    .upsert(
      {
        league_id: leagueId,
        country_id: values.countryId,
        is_primary: true,
      },
      {
        onConflict: "league_id,country_id",
      },
    );

  if (countryError) {
    redirectWithError(
      errorPath,
      `No fue posible asignar el país principal: ${countryError.message}`,
    );
  }

  revalidateLeaguePaths(
    currentLeague.slug,
    values.league.slug,
  );

  redirect("/admin/ligas?updated=1");
}

export async function archiveLeague(leagueId: string) {
  const user = await requireEditorialUser();
  const errorPath = "/admin/ligas";
  const supabase = await createClient();

  const { data: league, error } = await supabase
    .from("leagues")
    .update({
      editorial_status: "archived",
      updated_by: user.id,
    })
    .eq("id", leagueId)
    .select("slug")
    .maybeSingle();

  if (error) {
    redirectWithError(
      errorPath,
      `No fue posible archivar la liga: ${error.message}`,
    );
  }

  if (!league) {
    redirectWithError(
      errorPath,
      "La liga no existe o no tienes permisos para modificarla.",
    );
  }

  revalidateLeaguePaths(league.slug);

  redirect("/admin/ligas?archived=1");
}