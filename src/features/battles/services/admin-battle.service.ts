import "server-only";

import {
  getAdminBattleById as getAdminBattleByIdFromRepository,
  getAdminBattleFormOptions as getAdminBattleFormOptionsFromRepository,
  getAdminBattles as getAdminBattlesFromRepository,
} from "../repositories/supabase-admin-battle.repository";


export function getAdminBattles() {
  return getAdminBattlesFromRepository();
}

export function getAdminBattleById(id: string) {
  return getAdminBattleByIdFromRepository(id);
}

export function getAdminBattleFormOptions() {
  return getAdminBattleFormOptionsFromRepository();
}
