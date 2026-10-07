import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { LeagueCard } from "@/features/leagues/components/LeagueCard";
import { getLeagues } from "@/features/leagues/services/league.service";


const description =
  "Consulta ligas, países, temporadas y competiciones del circuito freestyle.";

export const metadata: Metadata = {
  title: "Ligas",
  description,
  alternates: {
    canonical: "/ligas",
  },
  openGraph: {
    type: "website",
    title: "Ligas de freestyle | Freestyle Total",
    description,
    url: "/ligas",
    images: [
      {
        url: "/images/brand/logo-primary.webp",
        alt: "Ligas de freestyle en Freestyle Total",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ligas de freestyle | Freestyle Total",
    description,
    images: ["/images/brand/logo-primary.webp"],
  },
};


export default async function LeaguesPage() {
  const leagues = await getLeagues();

  return (
    <main className="py-10">
      <Container>
        <h1 className="text-4xl font-bold">Ligas</h1>

        <p className="mt-3 max-w-2xl text-gray-400">
          Consulta ligas, rankings, países, temporadas y tablas de posiciones
          del circuito freestyle.
        </p>

        {leagues.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {leagues.map((league) => (
              <LeagueCard key={league.id} league={league} />
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-[var(--color-border)] bg-white p-6 text-[var(--color-muted)]">
            Todavía no hay ligas publicadas.
          </p>
        )}
      </Container>
    </main>
  );
}