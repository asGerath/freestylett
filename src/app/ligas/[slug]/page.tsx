// Página de detalle de una liga.
// Next obtiene el slug desde la URL: /ligas/fms-mexico

import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { leaguesMock } from "@/features/leagues/data/leagues.mock";

type LeagueDetailPageProps = {
  params: {
    slug: string;
  };
};

export default function LeagueDetailPage({ params }: LeagueDetailPageProps) {
  // Buscamos la liga por slug
  const league = leaguesMock.find((league) => league.slug === params.slug);

  // Si no existe, mostramos 404
  if (!league) {
    notFound();
  }

  return (
    <main className="py-10">
      <Container>
        <span className="text-sm font-bold text-[var(--color-accent)]">
          {league.country}
        </span>

        <h1 className="mt-3 text-4xl font-bold">{league.name}</h1>

        <p className="mt-4 max-w-2xl text-gray-400">
          {league.description}
        </p>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">Ranking y temporadas</h2>

          <p className="mt-3 text-gray-400">
            Aquí mostraremos ranking, tabla de posiciones, eventos de la liga y
            temporadas disponibles.
          </p>
        </section>
      </Container>
    </main>
  );
}