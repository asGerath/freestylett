import { cache } from "react";

import { supabaseRankingRepository } from "../repositories/supabase-ranking.repository";

const rankingRepository = supabaseRankingRepository;

export function getCurrentRankings() {
  return rankingRepository.getCurrent();
}

export const getCurrentRankingByLeagueSlug = cache(
  (leagueSlug: string) => {
    return rankingRepository.getCurrentByLeagueSlug(leagueSlug);
  },
);