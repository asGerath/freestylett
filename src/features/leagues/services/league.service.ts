import { cache } from "react";

import { supabaseLeagueRepository } from "../repositories/supabase-league.repository";

const leagueRepository = supabaseLeagueRepository;

export function getLeagues() {
  return leagueRepository.getAll();
}

export const getLeagueBySlug = cache((slug: string) => {
  return leagueRepository.getBySlug(slug);
});

export function getFeaturedLeagues(limit = 3) {
  return leagueRepository.getFeatured(limit);
}