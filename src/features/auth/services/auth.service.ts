import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type AppRole = Database["public"]["Enums"]["app_role"];

export type CurrentUser = {
  id: string;
  email: string | null;
  displayName: string;
  avatarPath: string | null;
  roles: AppRole[];
};

export const getCurrentUser = cache(
  async (): Promise<CurrentUser | null> => {
    const supabase = await createClient();

    const { data: claimsData, error: claimsError } =
      await supabase.auth.getClaims();

    const userId = claimsData?.claims?.sub;

    if (claimsError || !userId) {
      return null;
    }

    const [{ data: profile }, { data: roles }] = await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, avatar_path")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId),
    ]);

    return {
      id: userId,
      email:
        typeof claimsData.claims.email === "string"
          ? claimsData.claims.email
          : null,
      displayName: profile?.display_name ?? "Usuario",
      avatarPath: profile?.avatar_path ?? null,
      roles: roles?.map(({ role }) => role) ?? [],
    };
  },
);

export function hasRole(
  user: CurrentUser | null,
  role: AppRole,
): boolean {
  return user?.roles.includes(role) ?? false;
}

export function canAccessEditorialPanel(
  user: CurrentUser | null,
): boolean {
  return hasRole(user, "admin") || hasRole(user, "editor");
}