import "server-only";

import { createClient } from "@/lib/supabase/server";

import type {
  AdminBlogPostFormOptions,
  AdminBlogPostFormValues,
  AdminBlogPostSummary,
  BlogEditorialStatus,
} from "../types/blog.types";

type AdminBlogPostQueryRow = {
  id: string;
  title: string;
  slug: string;
  editorial_status: BlogEditorialStatus;
  published_at: string | null;
  updated_at: string;
  category: {
    name: string;
  } | null;
};

function mapAdminBlogPost(
  row: AdminBlogPostQueryRow,
): AdminBlogPostSummary {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category?.name ?? "Sin categoría",
    editorialStatus: row.editorial_status,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

export async function getAdminBlogPosts(): Promise<
  AdminBlogPostSummary[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      editorial_status,
      published_at,
      updated_at,
      category:post_categories!posts_category_id_fkey (
        name
      )
    `)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(
      `No fue posible consultar los artículos administrativos: ${error.message}`,
    );
  }

  return (data as unknown as AdminBlogPostQueryRow[]).map(
    mapAdminBlogPost,
  );
}

export async function getAdminBlogPostFormOptions(): Promise<
  AdminBlogPostFormOptions
> {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("post_categories")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(
      `No fue posible consultar las categorías: ${error.message}`,
    );
  }

  return {
    categories: categories ?? [],
  };
}

export async function getAdminBlogPostById(
  id: string,
): Promise<AdminBlogPostFormValues | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      excerpt,
      content_markdown,
      category_id,
      cover_path,
      editorial_status,
      seo_title,
      seo_description,
      source_url
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No fue posible consultar el artículo administrativo: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    contentMarkdown: data.content_markdown,
    categoryId: data.category_id ?? "",
    coverPath: data.cover_path ?? "",
    editorialStatus: data.editorial_status,
    seoTitle: data.seo_title ?? "",
    seoDescription: data.seo_description ?? "",
    sourceUrl: data.source_url ?? "",
  };
}