import "server-only";

import { createClient } from "@/lib/supabase/server";

import type {
  AdminBattleFormOptions,
  AdminBattleFormValues,
  AdminBattleSummary,
  BattleEditorialStatus,
  BattleFormat,
  BattleStage,
  BattleStatus,
} from "../types/battle.types";

type AdminBattleQueryRow = {
  id: string;
  title: string;
  slug: string;
  battle_order: number;
  stage: BattleStage;
  battle_format: BattleFormat;
  battle_status: BattleStatus;
  editorial_status: BattleEditorialStatus;
  updated_at: string;
  event: {
    title: string;
    slug: string;
  } | null;
  participants: Array<{
    side_number: number;
    slot_number: number;
    freestyler: {
      stage_name: string;
    } | null;
  }>;
};

function mapAdminBattle(
  row: AdminBattleQueryRow,
): AdminBattleSummary | null {
  if (!row.event) {
    return null;
  }

  const participantNames = [...row.participants]
    .sort((first, second) => {
      if (first.side_number !== second.side_number) {
        return first.side_number - second.side_number;
      }

      return first.slot_number - second.slot_number;
    })
    .map(
      (participant) =>
        participant.freestyler?.stage_name ?? "Participante sin nombre",
    );

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    battleOrder: row.battle_order,
    stage: row.stage,
    format: row.battle_format,
    status: row.battle_status,
    editorialStatus: row.editorial_status,
    eventTitle: row.event.title,
    eventSlug: row.event.slug,
    participantNames,
    updatedAt: row.updated_at,
  };
}


type AdminBattleEventQueryRow = {
  id: string;
  title: string;
  slug: string;
  event_leagues: Array<{
    season_id: string | null;
  }>;
  battles: Array<{
    battle_order: number;
  }>;
};

type AdminBattleSeasonQueryRow = {
  id: string;
  name: string;
  league: {
    name: string;
  } | null;
};

export async function getAdminBattles(): Promise<
  AdminBattleSummary[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("battles")
    .select(`
      id,
      title,
      slug,
      battle_order,
      stage,
      battle_format,
      battle_status,
      editorial_status,
      updated_at,
      event:events!battles_event_id_fkey (
        title,
        slug
      ),
      participants:battle_participants (
        side_number,
        slot_number,
        freestyler:freestylers!battle_participants_freestyler_id_fkey (
          stage_name
        )
      )
    `)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(
      `No fue posible consultar las batallas administrativas: ${error.message}`,
    );
  }

  return (data as unknown as AdminBattleQueryRow[])
    .map(mapAdminBattle)
    .filter(
      (battle): battle is AdminBattleSummary =>
        battle !== null,
    );
}

export async function getAdminBattleFormOptions(): Promise<
  AdminBattleFormOptions
> {
  const supabase = await createClient();

  const [eventsResult, seasonsResult] = await Promise.all([
    supabase
      .from("events")
      .select(`
        id,
        title,
        slug,
        event_leagues (
          season_id
        ),
        battles (
          battle_order
        )
      `)
      .neq("editorial_status", "archived")
      .order("starts_at", { ascending: false }),

    supabase
      .from("league_seasons")
      .select(`
        id,
        name,
        league:leagues!league_seasons_league_id_fkey (
          name
        )
      `)
      .neq("editorial_status", "archived")
      .order("name", { ascending: true }),
  ]);

  if (eventsResult.error) {
    throw new Error(
      `No fue posible consultar los eventos para la batalla: ${eventsResult.error.message}`,
    );
  }

  if (seasonsResult.error) {
    throw new Error(
      `No fue posible consultar las temporadas para la batalla: ${seasonsResult.error.message}`,
    );
  }

  const eventRows =
    eventsResult.data as unknown as AdminBattleEventQueryRow[];

  const seasonRows =
    seasonsResult.data as unknown as AdminBattleSeasonQueryRow[];

  const events = eventRows.map((event) => ({
    id: event.id,
    title: event.title,
    slug: event.slug,
    nextBattleOrder:
      Math.max(
        0,
        ...event.battles.map((battle) => battle.battle_order),
      ) + 1,
  }));

  const seasons = seasonRows.map((season) => ({
    id: season.id,
    name: season.name,
    leagueName: season.league?.name ?? "Liga sin nombre",
    eventIds: eventRows
      .filter((event) =>
        event.event_leagues.some(
          (eventLeague) =>
            eventLeague.season_id === season.id,
        ),
      )
      .map((event) => event.id),
  }));

  return {
    events,
    seasons,
  };
}

export async function getAdminBattleById(
  id: string,
): Promise<AdminBattleFormValues | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("battles")
    .select(`
      id,
      event_id,
      season_id,
      title,
      slug,
      battle_order,
      stage,
      battle_format,
      battle_status,
      winner_side,
      decision_type,
      video_url,
      source_url,
      editorial_status
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No fue posible consultar la batalla administrativa: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    eventId: data.event_id,
    seasonId: data.season_id,
    title: data.title,
    slug: data.slug,
    battleOrder: data.battle_order,
    stage: data.stage,
    format: data.battle_format,
    status: data.battle_status,
    winnerSide: data.winner_side,
    decisionType: data.decision_type,
    videoUrl: data.video_url ?? "",
    sourceUrl: data.source_url ?? "",
    editorialStatus: data.editorial_status,
  };
}
