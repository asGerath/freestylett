import "server-only";

import {
  getAdminBattleFormOptions as getAdminBattleFormOptionsFromRepository,
  getAdminBattles as getAdminBattlesFromRepository,
} from "../repositories/supabase-admin-battle.repository";


export function getAdminBattles() {
  return getAdminBattlesFromRepository();
}

export function getAdminBattleFormOptions() {
  return getAdminBattleFormOptionsFromRepository();
}