import "server-only";

import { cache } from "react";

import {
  getAdminLeagueById as getAdminLeagueByIdFromRepository,
  getAdminLeagueFormOptions as getAdminLeagueFormOptionsFromRepository,
  getAdminLeagues as getAdminLeaguesFromRepository,
} from "../repositories/supabase-admin-league.repository";

export function getAdminLeagues() {
  return getAdminLeaguesFromRepository();
}

export function getAdminLeagueFormOptions() {
  return getAdminLeagueFormOptionsFromRepository();
}

export const getAdminLeagueById = cache((id: string) => {
  return getAdminLeagueByIdFromRepository(id);
});