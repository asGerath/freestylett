// Modelo público de una posición dentro de una clasificación.
export type RankingEntryItem = {
  id: string;
  position: number;
  rankingGroup: string;
  matchesPlayed: number;
  battleWins: number;
  battleWinsAfterReplica: number;
  battleLossesAfterReplica: number;
  battleLosses: number;
  points: number;
  scoreTotal: number;
  penaltyPoints: number;
  freestyler: {
    id: string;
    stageName: string;
    slug: string;
    country: string;
  };
};

// Snapshot público de una clasificación y sus posiciones.
export type RankingSnapshotItem = {
  id: string;
  name: string;
  capturedAt: string;
  sourceUrl: string;
  league: {
    id: string;
    name: string;
    slug: string;
  };
  season: {
    id: string;
    name: string;
    slug: string;
  };
  entries: RankingEntryItem[];
};