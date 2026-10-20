import { cache } from "react";

import { supabaseBattleRepository } from "../repositories/supabase-battle.repository";
import type { BattleFilters } from "../types/battle.types";

const battleRepository = supabaseBattleRepository;

export function getPublishedBattles(
  filters?: BattleFilters,
) {
  return battleRepository.getPublished(filters);
}

export const getPublishedBattleBySlug = cache(
  (slug: string) => {
    return battleRepository.getPublishedBySlug(slug);
  },
);