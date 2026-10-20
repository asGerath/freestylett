"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  canAccessEditorialPanel,
  getCurrentUser,
} from "@/features/auth/services/auth.service";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

import type { CreatorType } from "../types/creator.types";

type EditorialStatus =
  Database["public"]["Enums"]["editorial_status"];

const editorialStatuses: EditorialStatus[] = [
  "draft",
  "published",
  "archived",
];

const creatorTypes: CreatorType[] = [
  "person",
  "channel",
  "media",
];

function getRequiredString(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" && value.trim()
    ? value.trim()
    : null;
}

function getOptionalString(formData: FormData, field: string) {
  return getRequiredString(formData, field);
}

function redirectWithError(path: string, message: string): never {
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

function validateOptionalUrl(
  value: string | null,
  label: string,
  errorPath: string,
) {
  if (!value) {
    return;
  }

  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Unsupported protocol");
    }
  } catch {
    redirectWithError(
      errorPath,
      `${label} debe ser una URL HTTP o HTTPS válida.`,
    );
  }
}

function getCreatorFormValues(
  formData: FormData,
  errorPath: string,
) {
  const name = getRequiredString(formData, "name");
  const slug = getRequiredString(formData, "slug");
  const type = getRequiredString(formData, "type");
  const editorialStatus = getRequiredString(
    formData,
    "editorialStatus",
  );

  if (!name || !slug || !type || !editorialStatus) {
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

  if (!creatorTypes.includes(type as CreatorType)) {
    redirectWithError(
      errorPath,
      "El tipo de creador no es válido.",
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

  const links = {
    website_url: getOptionalString(formData, "websiteUrl"),
    youtube_url: getOptionalString(formData, "youtubeUrl"),
    instagram_url: getOptionalString(formData, "instagramUrl"),
    tiktok_url: getOptionalString(formData, "tiktokUrl"),
    twitch_url: getOptionalString(formData, "twitchUrl"),
    x_url: getOptionalString(formData, "xUrl"),
    source_url: getOptionalString(formData, "sourceUrl"),
  };

  const labels: Record<keyof typeof links, string> = {
    website_url: "El sitio web",
    youtube_url: "El enlace de YouTube",
    instagram_url: "El enlace de Instagram",
    tiktok_url: "El enlace de TikTok",
    twitch_url: "El enlace de Twitch",
    x_url: "El enlace de X",
    source_url: "La fuente",
  };

  for (const [key, value] of Object.entries(links)) {
    validateOptionalUrl(
      value,
      labels[key as keyof typeof links],
      errorPath,
    );
  }

  const specialties = Array.from(
    new Set(
      (getOptionalString(formData, "specialties") ?? "")
        .split(",")
        .map((specialty) => specialty.trim())
        .filter(Boolean),
    ),
  );

  return {
    name,
    slug,
    creator_type: type as CreatorType,
    handle: getOptionalString(formData, "handle"),
    description: getOptionalString(formData, "description"),
    country_id: getOptionalString(formData, "countryId"),
    city: getOptionalString(formData, "city"),
    image_path: getOptionalString(formData, "imagePath"),
    specialties,
    is_featured: formData.get("isFeatured") === "on",
    ...links,
    editorial_status:
      editorialStatus as EditorialStatus,
  };
}

function revalidateCreatorPaths(
  previousSlug?: string,
  nextSlug?: string,
) {
  revalidatePath("/");
  revalidatePath("/creadores");
  revalidatePath("/admin");
  revalidatePath("/admin/creadores");
  revalidatePath("/sitemap.xml");

  if (previousSlug) {
    revalidatePath(`/creadores/${previousSlug}`);
  }

  if (nextSlug) {
    revalidatePath(`/creadores/${nextSlug}`);
  }
}

export async function createCreator(formData: FormData) {
  const user = await requireEditorialUser();
  const errorPath = "/admin/creadores/nuevo";
  const values = getCreatorFormValues(formData, errorPath);
  const supabase = await createClient();

  const { error } = await supabase
    .from("creators")
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
        "Ya existe un creador con ese slug.",
      );
    }

    redirectWithError(
      errorPath,
      `No fue posible crear el perfil: ${error.message}`,
    );
  }

  revalidateCreatorPaths(undefined, values.slug);
  redirect("/admin/creadores?created=1");
}

export async function updateCreator(
  creatorId: string,
  formData: FormData,
) {
  const user = await requireEditorialUser();
  const errorPath = `/admin/creadores/${creatorId}/editar`;
  const values = getCreatorFormValues(formData, errorPath);
  const supabase = await createClient();

  const { data: currentCreator, error: queryError } =
    await supabase
      .from("creators")
      .select("slug, published_at")
      .eq("id", creatorId)
      .maybeSingle();

  if (queryError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar el perfil: ${queryError.message}`,
    );
  }

  if (!currentCreator) {
    redirectWithError(errorPath, "El creador ya no existe.");
  }

  const { error } = await supabase
    .from("creators")
    .update({
      ...values,
      updated_by: user.id,
      published_at:
        values.editorial_status === "published"
          ? currentCreator.published_at ??
            new Date().toISOString()
          : currentCreator.published_at,
    })
    .eq("id", creatorId);

  if (error) {
    if (error.code === "23505") {
      redirectWithError(
        errorPath,
        "Ya existe otro creador con ese slug.",
      );
    }

    redirectWithError(
      errorPath,
      `No fue posible actualizar el perfil: ${error.message}`,
    );
  }

  revalidateCreatorPaths(currentCreator.slug, values.slug);
  redirect("/admin/creadores?updated=1");
}

export async function archiveCreator(creatorId: string) {
  const user = await requireEditorialUser();
  const errorPath = "/admin/creadores";
  const supabase = await createClient();

  const { data: creator, error } = await supabase
    .from("creators")
    .update({
      editorial_status: "archived",
      updated_by: user.id,
    })
    .eq("id", creatorId)
    .select("slug")
    .maybeSingle();

  if (error) {
    redirectWithError(
      errorPath,
      `No fue posible archivar el perfil: ${error.message}`,
    );
  }

  if (!creator) {
    redirectWithError(
      errorPath,
      "El creador no existe o no tienes permisos para modificarlo.",
    );
  }

  revalidateCreatorPaths(creator.slug);
  redirect("/admin/creadores?archived=1");
}
