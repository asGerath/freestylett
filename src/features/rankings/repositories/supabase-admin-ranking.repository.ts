import "server-only";

import { createClient } from "@/lib/supabase/server";

import type {
  AdminRankingEntriesData,
  AdminRankingFormOptions,
  AdminRankingFormValues,
  AdminRankingParticipantsData,
  AdminRankingSummary,
} from "../types/ranking.types";

type AdminRankingParticipantsSnapshotRow = {
  id: string;
  name: string;
  season_id: string;
  season: {
    name: string;
    league: {
      name: string;
    } | null;
  } | null;
};

type AdminSeasonParticipantQueryRow = {
  id: string;
  freestyler_id: string;
  seed: number | null;
  is_active: boolean;
  freestyler: {
    stage_name: string;
    slug: string;
  } | null;
};

type AdminSeasonFreestylerQueryRow = {
  id: string;
  stage_name: string;
  slug: string;
  country: {
    name: string;
  } | null;
};


type AdminRankingEntriesQueryRow = {
  id: string;
  name: string;
  season_id: string;
  editorial_status: "draft" | "published" | "archived";
  is_current: boolean;
  season: {
    name: string;
    league: {
      name: string;
    } | null;
  } | null;
  entries: Array<{
    id: string;
    participant_id: string;
    ranking_group: string;
    position: number;
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
        stage_name: string;
        slug: string;
      } | null;
    } | null;
  }>;
};

type AdminRankingParticipantRow = {
  id: string;
  freestyler_id: string;
  freestyler: {
    stage_name: string;
    slug: string;
  } | null;
};

type AdminRankingQueryRow = {
  id: string;
  name: string;
  captured_at: string;
  is_current: boolean;
  editorial_status: "draft" | "published" | "archived";
  updated_at: string;
  season: {
    name: string;
    league: {
      name: string;
      slug: string;
    } | null;
  } | null;
  entries: Array<{
    count: number;
  }>;
};

type AdminRankingSeasonRow = {
  id: string;
  name: string;
  league: {
    name: string;
  } | null;
};

type AdminRankingFormRow = {
  id: string;
  season_id: string;
  name: string;
  captured_at: string;
  source_url: string;
  is_current: boolean;
  editorial_status: "draft" | "published" | "archived";
};

function mapAdminRanking(
  row: AdminRankingQueryRow,
): AdminRankingSummary | null {
  const season = row.season;
  const league = season?.league;

  if (!season || !league) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    leagueName: league.name,
    leagueSlug: league.slug,
    seasonName: season.name,
    capturedAt: row.captured_at,
    isCurrent: row.is_current,
    editorialStatus: row.editorial_status,
    entriesCount: row.entries[0]?.count ?? 0,
    updatedAt: row.updated_at,
  };
}

export async function getAdminRankings(): Promise<
  AdminRankingSummary[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ranking_snapshots")
    .select(`
      id,
      name,
      captured_at,
      is_current,
      editorial_status,
      updated_at,
      season:league_seasons!ranking_snapshots_season_id_fkey (
        name,
        league:leagues!league_seasons_league_id_fkey (
          name,
          slug
        )
      ),
      entries:ranking_entries (
        count
      )
    `)
    .order("captured_at", { ascending: false });

  if (error) {
    throw new Error(
      `No fue posible consultar los rankings administrativos: ${error.message}`,
    );
  }

  return (data as unknown as AdminRankingQueryRow[])
    .map(mapAdminRanking)
    .filter(
      (ranking): ranking is AdminRankingSummary =>
        ranking !== null,
    );
}


export async function getAdminRankingFormOptions(): Promise<
  AdminRankingFormOptions
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("league_seasons")
    .select(`
      id,
      name,
      league:leagues!league_seasons_league_id_fkey (
        name
      )
    `)
    .neq("editorial_status", "archived")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(
      `No fue posible consultar las temporadas: ${error.message}`,
    );
  }

  const seasons = (
    data as unknown as AdminRankingSeasonRow[]
  ).map((season) => ({
    id: season.id,
    name: season.name,
    leagueName: season.league?.name ?? "Liga sin nombre",
  }));

  return {
    seasons,
  };
}

export async function getAdminRankingById(
  id: string,
): Promise<AdminRankingFormValues | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ranking_snapshots")
    .select(`
      id,
      season_id,
      name,
      captured_at,
      source_url,
      is_current,
      editorial_status
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No fue posible consultar la clasificación: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  const row = data as AdminRankingFormRow;

  return {
    id: row.id,
    seasonId: row.season_id,
    name: row.name,
    capturedAt: row.captured_at,
    sourceUrl: row.source_url,
    isCurrent: row.is_current,
    editorialStatus: row.editorial_status,
  };
}

export async function getAdminRankingEntriesData(
  rankingId: string,
): Promise<AdminRankingEntriesData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ranking_snapshots")
    .select(`
      id,
      name,
      season_id,
      editorial_status,
      is_current,
      season:league_seasons!ranking_snapshots_season_id_fkey (
        name,
        league:leagues!league_seasons_league_id_fkey (
          name
        )
      ),
      entries:ranking_entries (
        id,
        participant_id,
        ranking_group,
        position,
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
            stage_name,
            slug
          )
        )
      )
    `)
    .eq("id", rankingId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No fue posible consultar las posiciones: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  const row = data as unknown as AdminRankingEntriesQueryRow;

  if (!row.season || !row.season.league) {
    throw new Error(
      "La clasificación no tiene una temporada o liga válida.",
    );
  }

  const {
    data: participantsData,
    error: participantsError,
  } = await supabase
    .from("league_season_participants")
    .select(`
      id,
      freestyler_id,
      freestyler:freestylers!league_season_participants_freestyler_id_fkey (
        stage_name,
        slug
      )
    `)
    .eq("season_id", row.season_id)
    .eq("is_active", true);

  if (participantsError) {
    throw new Error(
      `No fue posible consultar los participantes: ${participantsError.message}`,
    );
  }

  const participants = (
    participantsData as unknown as AdminRankingParticipantRow[]
  )
    .filter((participant) => participant.freestyler !== null)
    .map((participant) => ({
      id: participant.id,
      freestylerId: participant.freestyler_id,
      stageName:
        participant.freestyler?.stage_name ?? "Sin nombre",
      slug: participant.freestyler?.slug ?? "",
    }))
    .sort((first, second) =>
      first.stageName.localeCompare(second.stageName, "es"),
    );

  const entries = row.entries
    .filter(
      (entry) => entry.participant?.freestyler !== null,
    )
    .map((entry) => ({
      id: entry.id,
      participantId: entry.participant_id,
      stageName:
        entry.participant?.freestyler?.stage_name ??
        "Sin nombre",
      slug: entry.participant?.freestyler?.slug ?? "",
      rankingGroup: entry.ranking_group,
      position: entry.position,
      matchesPlayed: entry.matches_played,
      battleWins: entry.battle_wins,
      battleWinsAfterReplica:
        entry.battle_wins_after_replica,
      battleLossesAfterReplica:
        entry.battle_losses_after_replica,
      battleLosses: entry.battle_losses,
      points: entry.points,
      scoreTotal: entry.score_total,
      penaltyPoints: entry.penalty_points,
    }))
    .sort((first, second) => first.position - second.position);

  return {
    ranking: {
      id: row.id,
      name: row.name,
      seasonId: row.season_id,
      seasonName: row.season.name,
      leagueName: row.season.league.name,
      editorialStatus: row.editorial_status,
      isCurrent: row.is_current,
    },
    participants,
    entries,
  };
}

export async function getAdminRankingParticipantsData(
  rankingId: string,
): Promise<AdminRankingParticipantsData | null> {
  const supabase = await createClient();

  const { data: rankingData, error: rankingError } =
    await supabase
      .from("ranking_snapshots")
      .select(`
        id,
        name,
        season_id,
        season:league_seasons!ranking_snapshots_season_id_fkey (
          name,
          league:leagues!league_seasons_league_id_fkey (
            name
          )
        )
      `)
      .eq("id", rankingId)
      .maybeSingle();

  if (rankingError) {
    throw new Error(
      `No fue posible consultar la clasificación: ${rankingError.message}`,
    );
  }

  if (!rankingData) {
    return null;
  }

  const ranking =
    rankingData as unknown as AdminRankingParticipantsSnapshotRow;

  if (!ranking.season || !ranking.season.league) {
    throw new Error(
      "La clasificación no tiene una temporada o liga válida.",
    );
  }

  const [
    participantsResult,
    entriesResult,
    freestylersResult,
  ] = await Promise.all([
    supabase
      .from("league_season_participants")
      .select(`
        id,
        freestyler_id,
        seed,
        is_active,
        freestyler:freestylers!league_season_participants_freestyler_id_fkey (
          stage_name,
          slug
        )
      `)
      .eq("season_id", ranking.season_id),

    supabase
      .from("ranking_entries")
      .select("participant_id")
      .eq("snapshot_id", rankingId),

    supabase
      .from("freestylers")
      .select(`
        id,
        stage_name,
        slug,
        country:countries!freestylers_country_id_fkey (
          name
        )
      `)
      .neq("editorial_status", "archived")
      .order("stage_name", { ascending: true }),
  ]);

  if (participantsResult.error) {
    throw new Error(
      `No fue posible consultar los participantes: ${participantsResult.error.message}`,
    );
  }

  if (entriesResult.error) {
    throw new Error(
      `No fue posible consultar las posiciones: ${entriesResult.error.message}`,
    );
  }

  if (freestylersResult.error) {
    throw new Error(
      `No fue posible consultar los freestylers: ${freestylersResult.error.message}`,
    );
  }

  const participantRows =
    participantsResult.data as unknown as AdminSeasonParticipantQueryRow[];

  const freestylerRows =
    freestylersResult.data as unknown as AdminSeasonFreestylerQueryRow[];

  const participantIdsWithEntry = new Set(
    (entriesResult.data ?? []).map(
      (entry) => entry.participant_id,
    ),
  );

  const registeredFreestylerIds = new Set(
    participantRows.map(
      (participant) => participant.freestyler_id,
    ),
  );

  const participants = participantRows
    .filter((participant) => participant.freestyler !== null)
    .map((participant) => ({
      id: participant.id,
      freestylerId: participant.freestyler_id,
      stageName:
        participant.freestyler?.stage_name ?? "Sin nombre",
      slug: participant.freestyler?.slug ?? "",
      seed: participant.seed,
      isActive: participant.is_active,
      hasRankingEntry: participantIdsWithEntry.has(
        participant.id,
      ),
    }))
    .sort((first, second) =>
      first.stageName.localeCompare(second.stageName, "es"),
    );

  const availableFreestylers = freestylerRows
    .filter(
      (freestyler) =>
        !registeredFreestylerIds.has(freestyler.id),
    )
    .map((freestyler) => ({
      id: freestyler.id,
      stageName: freestyler.stage_name,
      slug: freestyler.slug,
      country:
        freestyler.country?.name ?? "Internacional",
    }));

  return {
    ranking: {
      id: ranking.id,
      name: ranking.name,
      seasonId: ranking.season_id,
      seasonName: ranking.season.name,
      leagueName: ranking.season.league.name,
    },
    participants,
    availableFreestylers,
  };
}