// Card visual de una liga.
// Navega al detalle de la liga usando su slug.

import Link from "next/link";
import type { LeagueItem } from "../types/league.types";

type LeagueCardProps = {
  league: LeagueItem;
};

export function LeagueCard({ league }: LeagueCardProps) {
  return (
    <Link href={`/ligas/${league.slug}`} className="block">
      <article className="h-full rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-[var(--color-accent)] hover:bg-white/10">
        {/* País */}
        <span className="text-sm text-[var(--color-accent)]">
          {league.country}
        </span>

        {/* Nombre de liga */}
        <h3 className="mt-2 text-xl font-bold">{league.name}</h3>

        {/* Descripción */}
        <p className="mt-3 text-sm text-gray-400">{league.description}</p>
      </article>
    </Link>
  );
}