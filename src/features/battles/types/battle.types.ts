export type BattleStage =
  | "group_stage"
  | "play_in"
  | "round_of_32"
  | "round_of_16"
  | "quarterfinal"
  | "semifinal"
  | "third_place"
  | "final"
  | "regular_round"
  | "exhibition"
  | "other";

export type BattleFormat =
  | "one_vs_one"
  | "two_vs_two"
  | "three_vs_three"
  | "crew"
  | "other";

export type BattleStatus =
  | "scheduled"
  | "live"
  | "finished"
  | "cancelled"
  | "postponed";

export type BattleDecisionType =
  | "direct"
  | "replica"
  | "jury"
  | "technical"
  | "walkover"
  | "draw";

export type BattleParticipantItem = {
  id: string;
  sideNumber: number;
  slotNumber: number;
  score: number | null;
  isWinner: boolean;
  freestyler: {
    id: string;
    stageName: string;
    slug: string;
    country: string;
  };
};

export type BattleItem = {
  id: string;
  title: string;
  slug: string;
  battleOrder: number;
  stage: BattleStage;
  format: BattleFormat;
  status: BattleStatus;
  winnerSide: number | null;
  decisionType: BattleDecisionType | null;
  videoUrl: string | null;
  sourceUrl: string;
  event: {
    id: string;
    title: string;
    slug: string;
    startsAt: string;
    city: string;
    country: string;
  };
  league: {
    id: string;
    name: string;
    slug: string;
  } | null;
  season: {
    id: string;
    name: string;
    slug: string;
  } | null;
  participants: BattleParticipantItem[];
};

export type BattleFilters = {
  event?: string;
  league?: string;
  country?: string;
  status?: BattleStatus;
  stage?: BattleStage;
  freestyler?: string;
};