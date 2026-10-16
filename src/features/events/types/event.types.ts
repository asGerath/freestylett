// Modelos de dominio consumidos por la interfaz.
// Los repositorios transforman sus fuentes de datos a estas estructuras.

export type EventStatus =
  | "draft"
  | "upcoming"
  | "live"
  | "finished"
  | "cancelled"
  | "postponed";

export type EventEditorialStatus =
  | "draft"
  | "published"
  | "archived";

export type EventParticipantRole =
  | "competitor"
  | "host"
  | "judge"
  | "dj"
  | "guest"
  | "caster";


export type AdminEventType =
  | "league_round"
  | "qualifier"
  | "regional"
  | "national_final"
  | "international_final"
  | "tournament"
  | "exhibition"
  | "other";

export type AdminEventStatus =
  | "scheduled"
  | "live"
  | "finished"
  | "cancelled"
  | "postponed";

export type AdminEventFormValues = {
  id: string;
  title: string;
  slug: string;
  description: string;
  countryId: string;
  city: string;
  venueName: string;
  startsAt: string;
  timeZone: string;
  eventType: AdminEventType;
  eventStatus: AdminEventStatus;
  editorialStatus: EventEditorialStatus;
  officialUrl: string;
};

export type EventParticipant = {
  id: string;
  name: string;
  slug?: string;
  country?: string;
  role: EventParticipantRole;
};

export type Event = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  country: string;
  city: string;
  venue: string;
  league: string;
  startsAt: string;
  timeZone: string;
  posterUrl?: string;
  officialUrl?: string;
  status: EventStatus;
  participants: EventParticipant[];
};

export type AdminEventSummary = {
  id: string;
  title: string;
  slug: string;
  country: string;
  city: string;
  startsAt: string;
  eventStatus: Exclude<EventStatus, "draft">;
  editorialStatus: EventEditorialStatus;
  updatedAt: string;
};

export type AdminEventFormOptions = {
  countries: Array<{
    id: string;
    name: string;
  }>;
};


export type EventFilters = {
  country?: string;
  league?: string;
  status?: EventStatus;
};