import "server-only";

import {
  getAdminEventById as getAdminEventByIdFromRepository,
  getAdminEventFormOptions as getAdminEventFormOptionsFromRepository,
  getAdminEvents as getAdminEventsFromRepository,
} from "../repositories/supabase-admin-event.repository";

export function getAdminEvents() {
  return getAdminEventsFromRepository();
}

export function getAdminEventFormOptions() {
  return getAdminEventFormOptionsFromRepository();
}

export function getAdminEventById(id: string) {
  return getAdminEventByIdFromRepository(id);
}