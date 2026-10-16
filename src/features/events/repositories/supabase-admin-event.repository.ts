import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";


import type {
  AdminEventFormOptions,
  AdminEventFormValues,
  AdminEventSummary,
  EventStatus,
} from "../types/event.types";


type DatabaseEventStatus =
  Database["public"]["Enums"]["event_status"];

type AdminEventQueryRow = {
  id: string;
  title: string;
  slug: string;
  city: string;
  starts_at: string;
  event_status: DatabaseEventStatus;
  editorial_status: Database["public"]["Enums"]["editorial_status"];
  updated_at: string;
  country: {
    name: string;
  } | null;
};

function mapEventStatus(
  status: DatabaseEventStatus,
): Exclude<EventStatus, "draft"> {
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

function mapAdminEvent(row: AdminEventQueryRow): AdminEventSummary {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    country: row.country?.name ?? "Sin país",
    city: row.city,
    startsAt: row.starts_at,
    eventStatus: mapEventStatus(row.event_status),
    editorialStatus: row.editorial_status,
    updatedAt: row.updated_at,
  };
}

export async function getAdminEvents(): Promise<AdminEventSummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select(`
      id,
      title,
      slug,
      city,
      starts_at,
      event_status,
      editorial_status,
      updated_at,
      country:countries!events_country_id_fkey (
        name
      )
    `)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(
      `No fue posible consultar los eventos administrativos: ${error.message}`,
    );
  }

  return (data as unknown as AdminEventQueryRow[]).map(mapAdminEvent);
}

export async function getAdminEventFormOptions(): Promise<AdminEventFormOptions> {
  const supabase = await createClient();

  const { data: countries, error } = await supabase
    .from("countries")
    .select("id, name")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(
      `No fue posible consultar los países: ${error.message}`,
    );
  }

  return {
    countries: countries ?? [],
  };
}

export async function getAdminEventById(
  id: string,
): Promise<AdminEventFormValues | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select(`
      id,
      title,
      slug,
      description,
      country_id,
      city,
      venue_name,
      starts_at,
      time_zone,
      event_type,
      event_status,
      editorial_status,
      official_url
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No fue posible consultar el evento administrativo: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    description: data.description ?? "",
    countryId: data.country_id,
    city: data.city,
    venueName: data.venue_name ?? "",
    startsAt: data.starts_at,
    timeZone: data.time_zone,
    eventType: data.event_type,
    eventStatus: data.event_status,
    editorialStatus: data.editorial_status,
    officialUrl: data.official_url ?? "",
  };
}