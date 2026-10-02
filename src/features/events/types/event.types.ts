// Modelo de dominio consumido por la interfaz.
// Los repositorios transforman sus fuentes de datos a esta estructura.

export type EventStatus =
  | "draft"
  | "upcoming"
  | "live"
  | "finished"
  | "cancelled"
  | "postponed";

export type EventParticipantRole =
  | "competitor"
  | "host"
  | "judge"
  | "dj"
  | "guest"
  | "caster";

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

export type EventFilters = {
  country?: string;
  league?: string;
  status?: EventStatus;
};
