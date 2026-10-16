import type { BlogPost } from "../types/blog.types";

export interface BlogRepository {
  getAll(): Promise<BlogPost[]>;
  getBySlug(slug: string): Promise<BlogPost | null>;
  getFeatured(limit?: number): Promise<BlogPost[]>;
}