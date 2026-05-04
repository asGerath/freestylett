// Preview de ligas para el Home.
// Muestra solo algunas ligas y enlaza a la página completa.

import { leaguesMock } from "../data/leagues.mock";
import { LeagueCard } from "./LeagueCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function LeaguesPreview() {
  // Solo mostramos 3 ligas en el Home
  const preview = leaguesMock.slice(0, 3);

  return (
    <section className="mt-16">
        <SectionHeader
          title="Ligas"
          description="Explora las principales ligas del circuito freestyle."
          href="/ligas"
        />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {preview.map((league) => (
          <LeagueCard key={league.id} league={league} />
        ))}
      </div>
    </section>
  );
}