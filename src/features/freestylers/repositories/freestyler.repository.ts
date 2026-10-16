import type { FreestylerItem } from "../types/freestyler.types";

export interface FreestylerRepository {
  getAll(): Promise<FreestylerItem[]>;
  getBySlug(slug: string): Promise<FreestylerItem | null>;
  getFeatured(limit?: number): Promise<FreestylerItem[]>;
}