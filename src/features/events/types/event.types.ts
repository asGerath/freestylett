// Definimos la estructura base de un evento.
// Esto nos ayuda a saber qué datos necesita la UI antes de conectar una base real.

export type EventStatus =
  | "draft"
  | "upcoming"
  | "live"
  | "finished"
  | "cancelled";

export type EventParticipantRole =
  | "competitor"
  | "host"
  | "judge"
  | "dj"
  | "guest";

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
