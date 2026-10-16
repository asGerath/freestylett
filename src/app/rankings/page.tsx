import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { RankingTable } from "@/features/rankings/components/RankingTable";
import { getCurrentRankings } from "@/features/rankings/services/ranking.service";

const description =
  "Consulta las clasificaciones actuales, posiciones y estadísticas de las principales ligas de freestyle.";

export const metadata: Metadata = {
  title: "Rankings",
  description,
  alternates: {
    canonical: "/rankings",
  },
  openGraph: {
    type: "website",
    title: "Rankings de freestyle | Freestyle Total",
    description,
    url: "/rankings",
    images: [
      {
        url: "/images/brand/logo-primary.webp",
        alt: "Rankings de freestyle en Freestyle Total",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rankings de freestyle | Freestyle Total",
    description,
    images: ["/images/brand/logo-primary.webp"],
  },
};

export default async function RankingsPage() {
  const rankings = await getCurrentRankings();

  return (
    <main className="py-10">
      <Container>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          Competencia
        </p>

        <h1 className="mt-3 text-4xl font-black">Rankings</h1>

        <p className="mt-3 max-w-3xl text-[var(--color-muted)]">
          Consulta las tablas de posiciones y estadísticas vigentes de las
          principales ligas del circuito freestyle.
        </p>

        {rankings.length > 0 ? (
          <div className="mt-8 space-y-8">
            {rankings.map((ranking) => (
              <RankingTable key={ranking.id} ranking={ranking} />
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-6 text-[var(--color-muted)]">
            Todavía no hay clasificaciones publicadas.
          </p>
        )}
      </Container>
    </main>
  );
}