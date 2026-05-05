// Definimos la estructura base de un evento.
// Esto nos ayuda a saber qué datos necesita la UI antes de conectar una base real.

export type EventStatus = "upcoming" | "live" | "finished" | "cancelled";

export type EventItem = {
  id: string;
  title: string;
  slug: string;
  country: string;
  city: string;
  venue: string;
  league: string;
  date: string;
  time: string;
  posterUrl?: string;
  status: EventStatus;
};