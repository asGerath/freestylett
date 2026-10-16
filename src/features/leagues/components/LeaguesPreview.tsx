import { SectionHeader } from "@/components/ui/SectionHeader";

import { getFeaturedLeagues } from "../services/league.service";
import { LeagueCard } from "./LeagueCard";

export async function LeaguesPreview() {
  const leagues = await getFeaturedLeagues(3);

  return (
    <section className="mt-16">
      <SectionHeader
        title="Ligas destacadas"
        description="Conoce las principales ligas del circuito freestyle."
        href="/ligas"
        linkLabel="Ver todas las ligas"
      />

      {leagues.length > 0 ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {leagues.map((league) => (
            <LeagueCard key={league.id} league={league} />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-[var(--color-muted)]">
          Todavía no hay ligas publicadas.
        </p>
      )}
    </section>
  );
}