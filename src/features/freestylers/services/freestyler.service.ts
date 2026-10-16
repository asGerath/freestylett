import { cache } from "react";

import { supabaseFreestylerRepository } from "../repositories/supabase-freestyler.repository";

const freestylerRepository = supabaseFreestylerRepository;

export function getFreestylers() {
  return freestylerRepository.getAll();
}

export const getFreestylerBySlug = cache((slug: string) => {
  return freestylerRepository.getBySlug(slug);
});

export function getFeaturedFreestylers(limit = 3) {
  return freestylerRepository.getFeatured(limit);
}