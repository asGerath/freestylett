import type { Event } from "../types/event.types";

export function formatEventDate(event: Event) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeZone: event.timeZone,
  }).format(new Date(event.startsAt));
}

export function formatEventTime(event: Event) {
  return new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: event.timeZone,
  }).format(new Date(event.startsAt));
}
