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

function getFreestylerFormValues(
  formData: FormData,
  errorPath: string,
) {
  const stageName = getRequiredString(
    formData,
    "stageName",
  );
  const slug = getRequiredString(formData, "slug");
  const countryId = getRequiredString(
    formData,
    "countryId",
  );
  const editorialStatus = getRequiredString(
    formData,
    "editorialStatus",
  );
  const birthDate = getOptionalString(
    formData,
    "birthDate",
  );

  if (
    !stageName ||
    !slug ||
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

  if (
    birthDate &&
    !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)
  ) {
    redirectWithError(
      errorPath,
      "La fecha de nacimiento no es válida.",
    );
  }

  return {
    stage_name: stageName,
    real_name: getOptionalString(formData, "realName"),
    aka: getOptionalString(formData, "aka"),
    slug,
    bio: getOptionalString(formData, "bio"),
    birth_date: birthDate,
    country_id: countryId,
    city: getOptionalString(formData, "city"),
    photo_path: getOptionalString(formData, "photoPath"),
    editorial_status:
      editorialStatus as EditorialStatus,
    instagram_url: getOptionalString(
      formData,
      "instagramUrl",
    ),
    tiktok_url: getOptionalString(
      formData,
      "tiktokUrl",
    ),
    youtube_url: getOptionalString(
      formData,
      "youtubeUrl",
    ),
    twitch_url: getOptionalString(
      formData,
      "twitchUrl",
    ),
    x_url: getOptionalString(formData, "xUrl"),
  };
}

function revalidateFreestylerPaths(
  previousSlug?: string,
  nextSlug?: string,
) {
  revalidatePath("/");
  revalidatePath("/freestylers");
  revalidatePath("/admin");
  revalidatePath("/admin/freestylers");

  if (previousSlug) {
    revalidatePath(`/freestylers/${previousSlug}`);
  }

  if (nextSlug) {
    revalidatePath(`/freestylers/${nextSlug}`);
  }
}

export async function createFreestyler(
  formData: FormData,
) {
  const user = await requireEditorialUser();
  const errorPath = "/admin/freestylers/nuevo";
  const values = getFreestylerFormValues(
    formData,
    errorPath,
  );
  const supabase = await createClient();

  const { error } = await supabase
    .from("freestylers")
    .insert({
      ...values,
      created_by: user.id,
      updated_by: user.id,
      published_at:
        values.editorial_status === "published"
          ? new Date().toISOString()
          : null,
    });

  if (error) {
    if (error.code === "23505") {
      redirectWithError(
        errorPath,
        "Ya existe un freestyler con ese slug.",
      );
    }

    redirectWithError(
      errorPath,
      `No fue posible crear el freestyler: ${error.message}`,
    );
  }

  revalidateFreestylerPaths(undefined, values.slug);

  redirect("/admin/freestylers?created=1");
}

export async function updateFreestyler(
  freestylerId: string,
  formData: FormData,
) {
  const user = await requireEditorialUser();
  const errorPath =
    `/admin/freestylers/${freestylerId}/editar`;
  const values = getFreestylerFormValues(
    formData,
    errorPath,
  );
  const supabase = await createClient();

  const {
    data: currentFreestyler,
    error: queryError,
  } = await supabase
    .from("freestylers")
    .select("slug, published_at")
    .eq("id", freestylerId)
    .maybeSingle();

  if (queryError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar el freestyler: ${queryError.message}`,
    );
  }

  if (!currentFreestyler) {
    redirectWithError(
      errorPath,
      "El freestyler ya no existe.",
    );
  }

  const { error } = await supabase
    .from("freestylers")
    .update({
      ...values,
      updated_by: user.id,
      published_at:
        values.editorial_status === "published"
          ? currentFreestyler.published_at ??
            new Date().toISOString()
          : currentFreestyler.published_at,
    })
    .eq("id", freestylerId);

  if (error) {
    if (error.code === "23505") {
      redirectWithError(
        errorPath,
        "Ya existe otro freestyler con ese slug.",
      );
    }

    redirectWithError(
      errorPath,
      `No fue posible actualizar el freestyler: ${error.message}`,
    );
  }

  revalidateFreestylerPaths(
    currentFreestyler.slug,
    values.slug,
  );

  redirect("/admin/freestylers?updated=1");
}

export async function archiveFreestyler(
  freestylerId: string,
) {
  const user = await requireEditorialUser();
  const errorPath = "/admin/freestylers";
  const supabase = await createClient();

  const { data: freestyler, error } = await supabase
    .from("freestylers")
    .update({
      editorial_status: "archived",
      updated_by: user.id,
    })
    .eq("id", freestylerId)
    .select("slug")
    .maybeSingle();

  if (error) {
    redirectWithError(
      errorPath,
      `No fue posible archivar el freestyler: ${error.message}`,
    );
  }

  if (!freestyler) {
    redirectWithError(
      errorPath,
      "El freestyler no existe o no tienes permisos para modificarlo.",
    );
  }

  revalidateFreestylerPaths(freestyler.slug);

  redirect("/admin/freestylers?archived=1");
}