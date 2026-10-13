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

function getBlogPostFormValues(
  formData: FormData,
  errorPath: string,
) {
  const title = getRequiredString(formData, "title");
  const slug = getRequiredString(formData, "slug");
  const excerpt = getRequiredString(formData, "excerpt");
  const categoryId = getRequiredString(
    formData,
    "categoryId",
  );
  const editorialStatus = getRequiredString(
    formData,
    "editorialStatus",
  );
  const contentMarkdown =
    getOptionalString(formData, "contentMarkdown") ?? "";
  const coverPath = getOptionalString(
    formData,
    "coverPath",
  );
  const sourceUrl = getOptionalString(
    formData,
    "sourceUrl",
  );

  if (
    !title ||
    !slug ||
    !excerpt ||
    !categoryId ||
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
    editorialStatus === "published" &&
    !contentMarkdown
  ) {
    redirectWithError(
      errorPath,
      "El contenido es obligatorio para publicar el artículo.",
    );
  }

  if (
    coverPath &&
    (/^https?:\/\//i.test(coverPath) ||
      coverPath.startsWith("//"))
  ) {
    redirectWithError(
      errorPath,
      "La portada debe ser una ruta relativa de Storage.",
    );
  }

  if (
    sourceUrl &&
    !/^https?:\/\//i.test(sourceUrl)
  ) {
    redirectWithError(
      errorPath,
      "La URL de la fuente debe comenzar con http:// o https://.",
    );
  }

  return {
    title,
    slug,
    excerpt,
    content_markdown: contentMarkdown,
    category_id: categoryId,
    cover_path: coverPath,
    editorial_status:
      editorialStatus as EditorialStatus,
    seo_title: getOptionalString(formData, "seoTitle"),
    seo_description: getOptionalString(
      formData,
      "seoDescription",
    ),
    source_url: sourceUrl,
  };
}

function revalidateBlogPostPaths(
  previousSlug?: string,
  nextSlug?: string,
) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/admin/articulos");

  if (previousSlug) {
    revalidatePath(`/blog/${previousSlug}`);
  }

  if (nextSlug) {
    revalidatePath(`/blog/${nextSlug}`);
  }
}

export async function createBlogPost(
  formData: FormData,
) {
  const user = await requireEditorialUser();
  const errorPath = "/admin/articulos/nuevo";
  const values = getBlogPostFormValues(
    formData,
    errorPath,
  );
  const supabase = await createClient();

  const { error } = await supabase
    .from("posts")
    .insert({
      ...values,
      author_id: user.id,
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
        "Ya existe un artículo con ese slug.",
      );
    }

    redirectWithError(
      errorPath,
      `No fue posible crear el artículo: ${error.message}`,
    );
  }

  revalidateBlogPostPaths(undefined, values.slug);

  redirect("/admin/articulos?created=1");
}

export async function updateBlogPost(
  postId: string,
  formData: FormData,
) {
  const user = await requireEditorialUser();
  const errorPath =
    `/admin/articulos/${postId}/editar`;
  const values = getBlogPostFormValues(
    formData,
    errorPath,
  );
  const supabase = await createClient();

  const { data: currentPost, error: queryError } =
    await supabase
      .from("posts")
      .select("slug, published_at")
      .eq("id", postId)
      .maybeSingle();

  if (queryError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar el artículo: ${queryError.message}`,
    );
  }

  if (!currentPost) {
    redirectWithError(
      errorPath,
      "El artículo ya no existe.",
    );
  }

  const { error } = await supabase
    .from("posts")
    .update({
      ...values,
      updated_by: user.id,
      published_at:
        values.editorial_status === "published"
          ? currentPost.published_at ??
            new Date().toISOString()
          : currentPost.published_at,
    })
    .eq("id", postId);

  if (error) {
    if (error.code === "23505") {
      redirectWithError(
        errorPath,
        "Ya existe otro artículo con ese slug.",
      );
    }

    redirectWithError(
      errorPath,
      `No fue posible actualizar el artículo: ${error.message}`,
    );
  }

  revalidateBlogPostPaths(
    currentPost.slug,
    values.slug,
  );

  redirect("/admin/articulos?updated=1");
}

export async function archiveBlogPost(
  postId: string,
) {
  const user = await requireEditorialUser();
  const errorPath = "/admin/articulos";
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("posts")
    .update({
      editorial_status: "archived",
      updated_by: user.id,
    })
    .eq("id", postId)
    .select("slug")
    .maybeSingle();

  if (error) {
    redirectWithError(
      errorPath,
      `No fue posible archivar el artículo: ${error.message}`,
    );
  }

  if (!post) {
    redirectWithError(
      errorPath,
      "El artículo no existe o no tienes permisos para modificarlo.",
    );
  }

  revalidateBlogPostPaths(post.slug);

  redirect("/admin/articulos?archived=1");
}