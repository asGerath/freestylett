import { eventsMock } from "../data/events.mock";
import type { Event, EventFilters } from "../types/event.types";
import type { EventRepository } from "./event.repository";

function matchesFilters(event: Event, filters?: EventFilters) {
  if (!filters) return true;

  return (
    (!filters.country || event.country === filters.country) &&
    (!filters.league || event.league === filters.league) &&
    (!filters.status || event.status === filters.status)
  );
}

export const mockEventRepository: EventRepository = {
  async getAll(filters) {
    return eventsMock.filter((event) => matchesFilters(event, filters));
  },
  async getBySlug(slug) {
    return eventsMock.find((event) => event.slug === slug) ?? null;
  },
  async getFeatured(limit = 3) {
    return eventsMock.slice(0, limit);
  },
};
