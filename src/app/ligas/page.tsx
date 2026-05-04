// Página completa de ligas.
// Muestra todas las ligas disponibles.

import { Container } from "@/components/ui/Container";
import { leaguesMock } from "@/features/leagues/data/leagues.mock";
import { LeagueCard } from "@/features/leagues/components/LeagueCard";

export default function LeaguesPage() {
  return (
    <main className="py-10">
      <Container>
        <h1 className="text-4xl font-bold">Ligas</h1>

        <p className="mt-3 max-w-2xl text-gray-400">
          Consulta ligas, rankings, países, temporadas y tablas de posiciones
          del circuito freestyle.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {leaguesMock.map((league) => (
            <LeagueCard key={league.id} league={league} />
          ))}
        </div>
      </Container>
    </main>
  );
}