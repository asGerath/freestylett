import "server-only";

import { createClient } from "@/lib/supabase/server";

import type { BattleRepository } from "./battle.repository";
import type {
  BattleFilters,
  BattleItem,
  BattleParticipantItem,
} from "../types/battle.types";

const BATTLE_SELECT = `
  id,
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
  event:events!battles_event_id_fkey (
    id,
    title,
    slug,
    starts_at,
    city,
    country:countries!events_country_id_fkey (
      name
    )
  ),
  season:league_seasons!battles_season_id_fkey (
    id,
    name,
    slug,
    league:leagues!league_seasons_league_id_fkey (
      id,
      name,
      slug
    )
  ),
  participants:battle_participants!battle_participants_battle_id_fkey (
    id,
    side_number,
    slot_number,
    score,
    freestyler:freestylers!battle_participants_freestyler_id_fkey (
      id,
      stage_name,
      slug,
      country:countries!freestylers_country_id_fkey (
        name
      )
    )
  )
`;

type BattleQueryRow = {
  id: string;
  title: string;
  slug: string;
  battle_order: number;
  stage: BattleItem["stage"];
  battle_format: BattleItem["format"];
  battle_status: BattleItem["status"];
  winner_side: number | null;
  decision_type: BattleItem["decisionType"];
  video_url: string | null;
  source_url: string | null;
  event: {
    id: string;
    title: string;
    slug: string;
    starts_at: string;
    city: string;
    country: {
      name: string;
    } | null;
  } | null;
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
  participants: Array<{
    id: string;
    side_number: number;
    slot_number: number;
    score: number | null;
    freestyler: {
      id: string;
      stage_name: string;
      slug: string;
      country: {
        name: string;
      } | null;
    } | null;
  }>;
};

function mapParticipant(
  participant: BattleQueryRow["participants"][number],
  winnerSide: number | null,
): BattleParticipantItem | null {
  const freestyler = participant.freestyler;

  if (!freestyler) {
    return null;
  }

  return {
    id: participant.id,
    sideNumber: participant.side_number,
    slotNumber: participant.slot_number,
    score: participant.score,
    isWinner:
      winnerSide !== null &&
      participant.side_number === winnerSide,
    freestyler: {
      id: freestyler.id,
      stageName: freestyler.stage_name,
      slug: freestyler.slug,
      country: freestyler.country?.name ?? "Internacional",
    },
  };
}

function mapBattle(row: BattleQueryRow): BattleItem | null {
  const event = row.event;

  if (!event) {
    return null;
  }

  const season = row.season;
  const league = season?.league ?? null;

  const participants = row.participants
    .map((participant) =>
      mapParticipant(participant, row.winner_side),
    )
    .filter(
      (
        participant,
      ): participant is BattleParticipantItem =>
        participant !== null,
    )
    .sort((first, second) => {
      if (first.sideNumber !== second.sideNumber) {
        return first.sideNumber - second.sideNumber;
      }

      return first.slotNumber - second.slotNumber;
    });

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    battleOrder: row.battle_order,
    stage: row.stage,
    format: row.battle_format,
    status: row.battle_status,
    winnerSide: row.winner_side,
    decisionType: row.decision_type,
    videoUrl: row.video_url,
    sourceUrl: row.source_url,
    event: {
      id: event.id,
      title: event.title,
      slug: event.slug,
      startsAt: event.starts_at,
      city: event.city,
      country: event.country?.name ?? "Internacional",
    },
    league: league
      ? {
          id: league.id,
          name: league.name,
          slug: league.slug,
        }
      : null,
    season: season
      ? {
          id: season.id,
          name: season.name,
          slug: season.slug,
        }
      : null,
    participants,
  };
}

function matchesFilters(
  battle: BattleItem,
  filters?: BattleFilters,
) {
  if (!filters) {
    return true;
  }

  if (
    filters.event &&
    battle.event.slug !== filters.event
  ) {
    return false;
  }

  if (
    filters.league &&
    battle.league?.slug !== filters.league
  ) {
    return false;
  }

  if (
    filters.country &&
    battle.event.country !== filters.country
  ) {
    return false;
  }

  if (
    filters.status &&
    battle.status !== filters.status
  ) {
    return false;
  }

  if (
    filters.stage &&
    battle.stage !== filters.stage
  ) {
    return false;
  }

  if (
    filters.freestyler &&
    !battle.participants.some(
      (participant) =>
        participant.freestyler.slug === filters.freestyler,
    )
  ) {
    return false;
  }

  return true;
}

async function getPublished(
  filters?: BattleFilters,
): Promise<BattleItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("battles")
    .select(BATTLE_SELECT)
    .eq("editorial_status", "published")
    .order("battle_order", { ascending: true });

  if (error) {
    throw new Error(
      `No fue posible consultar las batallas: ${error.message}`,
    );
  }

  return (data as unknown as BattleQueryRow[])
    .map(mapBattle)
    .filter(
      (battle): battle is BattleItem => battle !== null,
    )
    .filter((battle) => matchesFilters(battle, filters))
    .sort(
      (first, second) =>
        new Date(second.event.startsAt).getTime() -
        new Date(first.event.startsAt).getTime(),
    );
}

async function getPublishedBySlug(
  slug: string,
): Promise<BattleItem | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("battles")
    .select(BATTLE_SELECT)
    .eq("editorial_status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No fue posible consultar la batalla: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return mapBattle(data as unknown as BattleQueryRow);
}

export const supabaseBattleRepository: BattleRepository = {
  getPublished,
  getPublishedBySlug,
};
