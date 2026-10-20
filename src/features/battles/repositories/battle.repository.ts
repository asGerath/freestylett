import type {
  BattleFilters,
  BattleItem,
} from "../types/battle.types";

export interface BattleRepository {
  getPublished(filters?: BattleFilters): Promise<BattleItem[]>;

  getPublishedBySlug(slug: string): Promise<BattleItem | null>;
}