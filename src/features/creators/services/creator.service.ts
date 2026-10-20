import { cache } from "react";

import { supabaseCreatorRepository } from "../repositories/supabase-creator.repository";

const creatorRepository = supabaseCreatorRepository;

export function getCreators() {
  return creatorRepository.getAll();
}

export const getCreatorBySlug = cache((slug: string) => {
  return creatorRepository.getBySlug(slug);
});
