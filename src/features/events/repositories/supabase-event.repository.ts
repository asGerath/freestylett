import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

import type { EventRepository } from "./event.repository";
import type {
  Event,
  EventFilters,
  EventStatus,
} from "../types/event.types";

const EVENT_SELECT = `
  id,
  title,
  slug,
  description,
  city,
  venue_name,
  starts_at,
  time_zone,
  poster_path,
  official_url,
  event_status,
  country:countries!events_country_id_fkey (
    name
  ),
  venue:venues!events_venue_id_fkey (
    name
  ),
  event_leagues (
    is_primary,
    league:leagues!event_leagues_league_id_fkey (
      name
    )
  ),
  event_participants (
    id,
    display_name,
    role,
    display_order,
    freestyler:freestylers!event_participants_freestyler_id_fkey (
      slug,
      country:countries!freestylers_country_id_fkey (
        name
      )
    )
  )
`;

type DatabaseEventStatus =
  Database["public"]["Enums"]["event_status"];

type EventQueryRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  city: string;
  venue_name: string | null;
  starts_at: string;
  time_zone: string;
  poster_path: string | null;
  official_url: string | null;
  event_status: DatabaseEventStatus;
  country: {
    name: string;
  } | null;
  venue: {
    name: string;
  } | null;
  event_leagues: Array<{
    is_primary: boolean;
    league: {
      name: string;
    } | null;
  }>;
  event_participants: Array<{
    id: string;
    display_name: string;
    role: Database["public"]["Enums"]["participant_role"];
    display_order: number;
    freestyler: {
      slug: string;
      country: {
        name: string;
      } | null;
    } | null;
  }>;
};

function mapEventStatus(status: DatabaseEventStatus): EventStatus {
  switch (status) {
    case "scheduled":
      return "upcoming";
    case "live":
      return "live";
    case "finished":
      return "finished";
    case "cancelled":
      return "cancelled";
    case "postponed":
      return "postponed";
  }
}

function getPrimaryLeague(row: EventQueryRow) {
  const primaryLeague = row.event_leagues.find(
    (eventLeague) => eventLeague.is_primary,
  );

  return (
    primaryLeague?.league?.name ??
    row.event_leagues[0]?.league?.name ??
    "Independiente"
  );
}

function getPosterUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  posterPath: string | null,
) {
  if (!posterPath) {
    return undefined;
  }

  return supabase.storage
    .from("public-media")
    .getPublicUrl(posterPath).data.publicUrl;
}

function mapEvent(
  row: EventQueryRow,
  supabase: Awaited<ReturnType<typeof createClient>>,
): Event {
  const participants = [...row.event_participants]
    .sort((first, second) => first.display_order - second.display_order)
    .map((participant) => ({
      id: participant.id,
      name: participant.display_name,
      slug: participant.freestyler?.slug,
      country: participant.freestyler?.country?.name,
      role: participant.role,
    }));

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? undefined,
    country: row.country?.name ?? "Sin país",
    city: row.city,
    venue: row.venue?.name ?? row.venue_name ?? "Por confirmar",
    league: getPrimaryLeague(row),
    startsAt: row.starts_at,
    timeZone: row.time_zone,
    posterUrl: getPosterUrl(supabase, row.poster_path),
    officialUrl: row.official_url ?? undefined,
    status: mapEventStatus(row.event_status),
    participants,
  };
}

function matchesFilters(event: Event, filters?: EventFilters) {
  if (!filters) {
    return true;
  }

  return (
    (!filters.country || event.country === filters.country) &&
    (!filters.league || event.league === filters.league) &&
    (!filters.status || event.status === filters.status)
  );
}

async function getAll(filters?: EventFilters): Promise<Event[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("editorial_status", "published")
    .order("starts_at", { ascending: true });

  if (error) {
    throw new Error(`No fue posible consultar los eventos: ${error.message}`);
  }

  return (data as unknown as EventQueryRow[])
    .map((event) => mapEvent(event, supabase))
    .filter((event) => matchesFilters(event, filters));
}

async function getBySlug(slug: string): Promise<Event | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("slug", slug)
    .eq("editorial_status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(`No fue posible consultar el evento: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapEvent(data as unknown as EventQueryRow, supabase);
}

async function getFeatured(limit = 3): Promise<Event[]> {
  const events = await getAll();

  return events.slice(0, limit);
}

export const supabaseEventRepository: EventRepository = {
  getAll,
  getBySlug,
  getFeatured,
};