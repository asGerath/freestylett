import { cache } from "react";

import { supabaseBlogRepository } from "../repositories/supabase-blog.repository";

const blogRepository = supabaseBlogRepository;

export function getBlogPosts() {
  return blogRepository.getAll();
}

export const getBlogPostBySlug = cache((slug: string) => {
  return blogRepository.getBySlug(slug);
});

export function getFeaturedBlogPosts(limit = 3) {
  return blogRepository.getFeatured(limit);
}