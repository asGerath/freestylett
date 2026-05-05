// Card visual de una liga.
// Navega al detalle de la liga usando su slug.

import Link from "next/link";
import type { LeagueItem } from "../types/league.types";
import { Card } from "@/components/ui/Card";

type LeagueCardProps = {
  league: LeagueItem;
};

export function LeagueCard({ league }: LeagueCardProps) {
  return (
    <Link href={`/ligas/${league.slug}`} className="block">

      <Card>
        {/* País */}
        <span className="text-sm text-[var(--color-accent)]">
          {league.country}
        </span>

        {/* Nombre de liga */}
        <h3 className="mt-2 text-xl font-bold">{league.name}</h3>

        {/* Descripción */}
        <p className="mt-3 text-sm text-gray-400">{league.description}</p>
      </Card>
    </Link>
  );
}