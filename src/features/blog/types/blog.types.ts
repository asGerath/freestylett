// Modelo base de un post del blog.
// Más adelante vendrá desde Supabase o CMS.

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  publishedAt: string;
};