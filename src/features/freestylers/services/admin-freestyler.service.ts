import "server-only";

import { cache } from "react";

import {
  getAdminFreestylerById as getAdminFreestylerByIdFromRepository,
  getAdminFreestylerFormOptions as getAdminFreestylerFormOptionsFromRepository,
  getAdminFreestylers as getAdminFreestylersFromRepository,
} from "../repositories/supabase-admin-freestyler.repository";

export function getAdminFreestylers() {
  return getAdminFreestylersFromRepository();
}

export function getAdminFreestylerFormOptions() {
  return getAdminFreestylerFormOptionsFromRepository();
}

export const getAdminFreestylerById = cache(
  (id: string) => {
    return getAdminFreestylerByIdFromRepository(id);
  },
);