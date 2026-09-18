import type { Event, EventFilters } from "../types/event.types";

export interface EventRepository {
  getAll(filters?: EventFilters): Promise<Event[]>;
  getBySlug(slug: string): Promise<Event | null>;
  getFeatured(limit?: number): Promise<Event[]>;
}
