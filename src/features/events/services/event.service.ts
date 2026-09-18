import { mockEventRepository } from "../repositories/mock-event.repository";
import type { EventFilters } from "../types/event.types";

// Change the selected provider at this boundary when Supabase is ready.
const eventRepository = mockEventRepository;

export function getEvents(filters?: EventFilters) {
  return eventRepository.getAll(filters);
}

export function getEventBySlug(slug: string) {
  return eventRepository.getBySlug(slug);
}

export function getFeaturedEvents(limit = 3) {
  return eventRepository.getFeatured(limit);
}
