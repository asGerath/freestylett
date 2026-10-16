export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string | null;
  category: string;
  publishedAt: string;
  coverPath: string | null;
};

export type BlogEditorialStatus =
  | "draft"
  | "published"
  | "archived";

export type AdminBlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  category: string;
  editorialStatus: BlogEditorialStatus;
  publishedAt: string | null;
  updatedAt: string;
};

export type AdminBlogPostFormOptions = {
  categories: Array<{
    id: string;
    name: string;
  }>;
};

export type AdminBlogPostFormValues = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  categoryId: string;
  coverPath: string;
  editorialStatus: BlogEditorialStatus;
  seoTitle: string;
  seoDescription: string;
  sourceUrl: string;
};