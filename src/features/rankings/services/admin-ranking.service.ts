import "server-only";

import { cache } from "react";

import {
  getAdminRankingById as getAdminRankingByIdFromRepository,
  getAdminRankingFormOptions as getAdminRankingFormOptionsFromRepository,
  getAdminRankings as getAdminRankingsFromRepository,
  getAdminRankingEntriesData as getAdminRankingEntriesDataFromRepository,
  getAdminRankingParticipantsData as getAdminRankingParticipantsDataFromRepository,
} from "../repositories/supabase-admin-ranking.repository";

export function getAdminRankings() {
  return getAdminRankingsFromRepository();
}

export function getAdminRankingFormOptions() {
  return getAdminRankingFormOptionsFromRepository();
}

export const getAdminRankingById = cache((id: string) => {
  return getAdminRankingByIdFromRepository(id);
});

export const getAdminRankingEntriesData = cache(
  (rankingId: string) => {
    return getAdminRankingEntriesDataFromRepository(
      rankingId,
    );
  },
);

export const getAdminRankingParticipantsData = cache(
  (rankingId: string) => {
    return getAdminRankingParticipantsDataFromRepository(
      rankingId,
    );
  },
);