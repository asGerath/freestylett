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
  mvpCount: number;
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

export type RankingEditorialStatus =
  | "draft"
  | "published"
  | "archived";

export type AdminRankingSummary = {
  id: string;
  name: string;
  leagueName: string;
  leagueSlug: string;
  seasonName: string;
  capturedAt: string;
  isCurrent: boolean;
  editorialStatus: RankingEditorialStatus;
  entriesCount: number;
  updatedAt: string;
};

export type AdminRankingSeasonOption = {
  id: string;
  name: string;
  leagueName: string;
};

export type AdminRankingFormOptions = {
  seasons: AdminRankingSeasonOption[];
};

export type AdminRankingFormValues = {
  id: string;
  seasonId: string;
  name: string;
  capturedAt: string;
  sourceUrl: string;
  isCurrent: boolean;
  editorialStatus: RankingEditorialStatus;
};

export type AdminRankingParticipantOption = {
  id: string;
  freestylerId: string;
  stageName: string;
  slug: string;
};

export type AdminRankingEntryItem = {
  id: string;
  participantId: string;
  stageName: string;
  slug: string;
  rankingGroup: string;
  position: number;
  matchesPlayed: number;
  battleWins: number;
  battleWinsAfterReplica: number;
  battleLossesAfterReplica: number;
  battleLosses: number;
  points: number;
  scoreTotal: number;
  penaltyPoints: number;
  mvpCount: number;
};

export type AdminRankingEntriesData = {
  ranking: {
    id: string;
    name: string;
    seasonId: string;
    seasonName: string;
    leagueName: string;
    editorialStatus: RankingEditorialStatus;
    isCurrent: boolean;
  };
  participants: AdminRankingParticipantOption[];
  entries: AdminRankingEntryItem[];
};

export type AdminRankingEntryFormValues = {
  id: string;
  participantId: string;
  rankingGroup: string;
  position: number;
  matchesPlayed: number;
  battleWins: number;
  battleWinsAfterReplica: number;
  battleLossesAfterReplica: number;
  battleLosses: number;
  points: number;
  scoreTotal: number;
  penaltyPoints: number;
  mvpCount: number;
};

export type AdminSeasonParticipantItem = {
  id: string;
  freestylerId: string;
  stageName: string;
  slug: string;
  seed: number | null;
  isActive: boolean;
  hasRankingEntry: boolean;
};

export type AdminSeasonFreestylerOption = {
  id: string;
  stageName: string;
  slug: string;
  country: string;
};

export type AdminRankingParticipantsData = {
  ranking: {
    id: string;
    name: string;
    seasonId: string;
    seasonName: string;
    leagueName: string;
  };
  participants: AdminSeasonParticipantItem[];
  availableFreestylers: AdminSeasonFreestylerOption[];
};