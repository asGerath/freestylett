import "server-only";

import { cache } from "react";

import {
  getAdminBlogPostById as getAdminBlogPostByIdFromRepository,
  getAdminBlogPostFormOptions as getAdminBlogPostFormOptionsFromRepository,
  getAdminBlogPosts as getAdminBlogPostsFromRepository,
} from "../repositories/supabase-admin-blog.repository";

export function getAdminBlogPosts() {
  return getAdminBlogPostsFromRepository();
}

export function getAdminBlogPostFormOptions() {
  return getAdminBlogPostFormOptionsFromRepository();
}

export const getAdminBlogPostById = cache(
  (id: string) => {
    return getAdminBlogPostByIdFromRepository(id);
  },
);