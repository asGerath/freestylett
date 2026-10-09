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