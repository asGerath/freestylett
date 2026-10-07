import type { LeagueItem } from "../types/league.types";

export interface LeagueRepository {
  getAll(): Promise<LeagueItem[]>;
  getBySlug(slug: string): Promise<LeagueItem | null>;
  getFeatured(limit?: number): Promise<LeagueItem[]>;
}