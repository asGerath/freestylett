import type { CreatorItem } from "../types/creator.types";

export interface CreatorRepository {
  getAll(): Promise<CreatorItem[]>;
  getBySlug(slug: string): Promise<CreatorItem | null>;
}
