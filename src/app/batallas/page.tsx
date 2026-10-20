import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { BattleCard } from "@/features/battles/components/BattleCard";
import { getPublishedBattles } from "@/features/battles/services/battle.service";

const description =
  "Consulta resultados, participantes y videos de las principales batallas del circuito freestyle.";

export const metadata: Metadata = {
  title: "Batallas",
  description,
  alternates: {
    canonical: "/batallas",
  },
  openGraph: {
    type: "website",
    title: "Batallas de freestyle | Freestyle Total",
    description,
    url: "/batallas",
    images: [
      {
        url: "/images/brand/logo-primary.webp",
        alt: "Batallas de freestyle en Freestyle Total",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Batallas de freestyle | Freestyle Total",
    description,
    images: ["/images/brand/logo-primary.webp"],
  },
};

export default async function BattlesPage() {
  const battles = await getPublishedBattles();

  return (
    <main className="py-10">
      <Container>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          Competencia
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Batallas
        </h1>

        <p className="mt-3 max-w-3xl text-[var(--color-muted)]">
          Consulta enfrentamientos, participantes, resultados y
          material oficial de las principales competencias de
          freestyle.
        </p>

        {battles.length > 0 ? (
          <div className="mt-8 space-y-6">
            {battles.map((battle) => (
              <BattleCard
                key={battle.id}
                battle={battle}
              />
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-6 text-[var(--color-muted)]">
            Todavía no hay batallas publicadas.
          </p>
        )}
      </Container>
    </main>
  );
}