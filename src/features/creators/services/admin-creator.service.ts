import "server-only";

import { cache } from "react";

import {
  getAdminCreatorById as getAdminCreatorByIdFromRepository,
  getAdminCreatorFormOptions as getAdminCreatorFormOptionsFromRepository,
  getAdminCreators as getAdminCreatorsFromRepository,
} from "../repositories/supabase-admin-creator.repository";

export function getAdminCreators() {
  return getAdminCreatorsFromRepository();
}

export function getAdminCreatorFormOptions() {
  return getAdminCreatorFormOptionsFromRepository();
}

export const getAdminCreatorById = cache((id: string) => {
  return getAdminCreatorByIdFromRepository(id);
});
