import type { RankingSnapshotItem } from "../types/ranking.types";

export interface RankingRepository {
  getCurrent(): Promise<RankingSnapshotItem[]>;

  getCurrentByLeagueSlug(
    leagueSlug: string,
  ): Promise<RankingSnapshotItem | null>;
}