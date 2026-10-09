import "server-only";

import { createClient } from "@/lib/supabase/server";

import type { BlogRepository } from "./blog.repository";
import type { BlogPost } from "../types/blog.types";

const BLOG_SELECT = `
  id,
  title,
  slug,
  excerpt,
  content_markdown,
  cover_path,
  published_at,
  category:post_categories!posts_category_id_fkey (
    name
  )
`;

type BlogQueryRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_markdown: string;
  cover_path: string | null;
  published_at: string;
  category: {
    name: string;
  } | null;
};

function mapBlogPost(row: BlogQueryRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    contentMarkdown: row.content_markdown,
    category: row.category?.name ?? "Sin categoría",
    publishedAt: row.published_at,
    coverPath: row.cover_path,
  };
}

async function getAll(): Promise<BlogPost[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(BLOG_SELECT)
    .eq("editorial_status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(
      `No fue posible consultar los artículos: ${error.message}`,
    );
  }

  return (data as unknown as BlogQueryRow[]).map(mapBlogPost);
}

async function getBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(BLOG_SELECT)
    .eq("slug", slug)
    .eq("editorial_status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(
      `No fue posible consultar el artículo: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return mapBlogPost(data as unknown as BlogQueryRow);
}

async function getFeatured(limit = 3): Promise<BlogPost[]> {
  const posts = await getAll();

  return posts.slice(0, limit);
}

export const supabaseBlogRepository: BlogRepository = {
  getAll,
  getBySlug,
  getFeatured,
};