import "server-only";

import { createClient } from "@/lib/supabase/server";

import type { RankingRepository } from "./ranking.repository";
import type {
  RankingEntryItem,
  RankingSnapshotItem,
} from "../types/ranking.types";

const RANKING_SELECT = `
  id,
  name,
  captured_at,
  source_url,
  season:league_seasons!ranking_snapshots_season_id_fkey (
    id,
    name,
    slug,
    league:leagues!league_seasons_league_id_fkey (
      id,
      name,
      slug
    )
  ),
  entries:ranking_entries (
    id,
    position,
    ranking_group,
    matches_played,
    battle_wins,
    battle_wins_after_replica,
    battle_losses_after_replica,
    battle_losses,
    points,
    score_total,
    penalty_points,
    participant:league_season_participants!ranking_entries_participant_id_fkey (
      freestyler:freestylers!league_season_participants_freestyler_id_fkey (
        id,
        stage_name,
        slug,
        country:countries!freestylers_country_id_fkey (
          name
        )
      )
    )
  )
`;

type RankingQueryRow = {
  id: string;
  name: string;
  captured_at: string;
  source_url: string;
  season: {
    id: string;
    name: string;
    slug: string;
    league: {
      id: string;
      name: string;
      slug: string;
    } | null;
  } | null;
  entries: Array<{
    id: string;
    position: number;
    ranking_group: string;
    matches_played: number;
    battle_wins: number;
    battle_wins_after_replica: number;
    battle_losses_after_replica: number;
    battle_losses: number;
    points: number;
    score_total: number;
    penalty_points: number;
    participant: {
      freestyler: {
        id: string;
        stage_name: string;
        slug: string;
        country: {
          name: string;
        } | null;
      } | null;
    } | null;
  }>;
};

function mapEntry(
  entry: RankingQueryRow["entries"][number],
): RankingEntryItem | null {
  const freestyler = entry.participant?.freestyler;

  if (!freestyler) {
    return null;
  }

  return {
    id: entry.id,
    position: entry.position,
    rankingGroup: entry.ranking_group,
    matchesPlayed: entry.matches_played,
    battleWins: entry.battle_wins,
    battleWinsAfterReplica: entry.battle_wins_after_replica,
    battleLossesAfterReplica: entry.battle_losses_after_replica,
    battleLosses: entry.battle_losses,
    points: entry.points,
    scoreTotal: entry.score_total,
    penaltyPoints: entry.penalty_points,
    freestyler: {
      id: freestyler.id,
      stageName: freestyler.stage_name,
      slug: freestyler.slug,
      country: freestyler.country?.name ?? "Internacional",
    },
  };
}

function mapRanking(row: RankingQueryRow): RankingSnapshotItem | null {
  const season = row.season;
  const league = season?.league;

  if (!season || !league) {
    return null;
  }

  const entries = row.entries
    .map(mapEntry)
    .filter((entry): entry is RankingEntryItem => entry !== null)
    .sort((first, second) => first.position - second.position);

  return {
    id: row.id,
    name: row.name,
    capturedAt: row.captured_at,
    sourceUrl: row.source_url,
    league: {
      id: league.id,
      name: league.name,
      slug: league.slug,
    },
    season: {
      id: season.id,
      name: season.name,
      slug: season.slug,
    },
    entries,
  };
}

async function getCurrent(): Promise<RankingSnapshotItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ranking_snapshots")
    .select(RANKING_SELECT)
    .eq("editorial_status", "published")
    .eq("is_current", true)
    .order("captured_at", { ascending: false });

  if (error) {
    throw new Error(
      `No fue posible consultar los rankings: ${error.message}`,
    );
  }

  return (data as unknown as RankingQueryRow[])
    .map(mapRanking)
    .filter(
      (ranking): ranking is RankingSnapshotItem => ranking !== null,
    );
}

async function getCurrentByLeagueSlug(
  leagueSlug: string,
): Promise<RankingSnapshotItem | null> {
  const rankings = await getCurrent();

  return (
    rankings.find((ranking) => ranking.league.slug === leagueSlug) ??
    null
  );
}

export const supabaseRankingRepository: RankingRepository = {
  getCurrent,
  getCurrentByLeagueSlug,
};