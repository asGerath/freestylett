import "server-only";

import { createClient } from "@/lib/supabase/server";

import type {
  AdminBattleFormOptions,
  AdminBattleFormValues,
  AdminBattleParticipantsData,
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

type AdminBattleParticipantsQueryRow = {
  id: string;
  title: string;
  event_id: string;
  season_id: string | null;
  battle_format: BattleFormat;
  battle_status: BattleStatus;
  event: {
    title: string;
  } | null;
  participants: Array<{
    id: string;
    freestyler_id: string;
    side_number: number;
    slot_number: number;
    score: number | null;
    freestyler: {
      stage_name: string;
      slug: string;
    } | null;
  }>;
};

type AdminBattleEventParticipantRow = {
  freestyler_id: string;
  freestyler: {
    stage_name: string;
    slug: string;
    country: {
      name: string;
    } | null;
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


export async function getAdminBattleParticipantsData(
  battleId: string,
): Promise<AdminBattleParticipantsData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("battles")
    .select(`
      id,
      title,
      event_id,
      season_id,
      battle_format,
      battle_status,
      event:events!battles_event_id_fkey (
        title
      ),
      participants:battle_participants (
        id,
        freestyler_id,
        side_number,
        slot_number,
        score,
        freestyler:freestylers!battle_participants_freestyler_id_fkey (
          stage_name,
          slug
        )
      )
    `)
    .eq("id", battleId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No fue posible consultar los participantes de la batalla: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  const row =
    data as unknown as AdminBattleParticipantsQueryRow;

  if (!row.event) {
    throw new Error(
      "La batalla no tiene un evento válido.",
    );
  }

  const [
    eventParticipantsResult,
    seasonParticipantsResult,
  ] = await Promise.all([
    supabase
      .from("event_participants")
      .select(`
        freestyler_id,
        freestyler:freestylers!event_participants_freestyler_id_fkey (
          stage_name,
          slug,
          country:countries!freestylers_country_id_fkey (
            name
          )
        )
      `)
      .eq("event_id", row.event_id)
      .eq("role", "competitor"),

    row.season_id
      ? supabase
          .from("league_season_participants")
          .select("freestyler_id")
          .eq("season_id", row.season_id)
          .eq("is_active", true)
      : Promise.resolve({
          data: null,
          error: null,
        }),
  ]);

  if (eventParticipantsResult.error) {
    throw new Error(
      `No fue posible consultar los competidores del evento: ${eventParticipantsResult.error.message}`,
    );
  }

  if (seasonParticipantsResult.error) {
    throw new Error(
      `No fue posible consultar los participantes de la temporada: ${seasonParticipantsResult.error.message}`,
    );
  }

  const eventParticipantRows =
    eventParticipantsResult.data as unknown as AdminBattleEventParticipantRow[];

  const seasonFreestylerIds = row.season_id
    ? new Set(
        (seasonParticipantsResult.data ?? []).map(
          (participant) => participant.freestyler_id,
        ),
      )
    : null;

  const registeredFreestylerIds = new Set(
    row.participants.map(
      (participant) => participant.freestyler_id,
    ),
  );

  const participants = row.participants
    .filter(
      (participant) => participant.freestyler !== null,
    )
    .map((participant) => ({
      id: participant.id,
      freestylerId: participant.freestyler_id,
      stageName:
        participant.freestyler?.stage_name ?? "Sin nombre",
      slug: participant.freestyler?.slug ?? "",
      sideNumber: participant.side_number,
      slotNumber: participant.slot_number,
      score: participant.score,
    }))
    .sort((first, second) => {
      if (first.sideNumber !== second.sideNumber) {
        return first.sideNumber - second.sideNumber;
      }

      return first.slotNumber - second.slotNumber;
    });

  const availableParticipants = eventParticipantRows
    .filter((participant) => {
      if (!participant.freestyler) {
        return false;
      }

      if (
        registeredFreestylerIds.has(
          participant.freestyler_id,
        )
      ) {
        return false;
      }

      if (
        seasonFreestylerIds &&
        !seasonFreestylerIds.has(
          participant.freestyler_id,
        )
      ) {
        return false;
      }

      return true;
    })
    .map((participant) => ({
      freestylerId: participant.freestyler_id,
      stageName:
        participant.freestyler?.stage_name ?? "Sin nombre",
      slug: participant.freestyler?.slug ?? "",
      country:
        participant.freestyler?.country?.name ??
        "Internacional",
    }))
    .sort((first, second) =>
      first.stageName.localeCompare(
        second.stageName,
        "es",
      ),
    );

  return {
    battle: {
      id: row.id,
      title: row.title,
      eventId: row.event_id,
      eventTitle: row.event.title,
      seasonId: row.season_id,
      format: row.battle_format,
      status: row.battle_status,
    },
    participants,
    availableParticipants,
  };
}