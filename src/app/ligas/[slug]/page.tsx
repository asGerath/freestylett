import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { getLeagueBySlug } from "@/features/leagues/services/league.service";
import { RankingTable } from "@/features/rankings/components/RankingTable";
import { getCurrentRankingByLeagueSlug } from "@/features/rankings/services/ranking.service";

type LeagueDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: LeagueDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const league = await getLeagueBySlug(slug);

  if (!league) {
    return {
      title: "Liga no encontrada",
      description: "La liga solicitada no está disponible.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description =
    league.description ??
    `Consulta información, eventos y temporadas de ${league.name}.`;

  const image =
    league.logoUrl ?? "/images/brand/logo-primary.webp";

  const canonicalPath = `/ligas/${league.slug}`;

  return {
    title: league.name,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      title: `${league.name} | Freestyle Total`,
      description,
      url: canonicalPath,
      images: [
        {
          url: image,
          alt: league.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${league.name} | Freestyle Total`,
      description,
      images: [image],
    },
  };
}

export default async function LeagueDetailPage({
  params,
}: LeagueDetailPageProps) {
  const { slug } = await params;

  const [league, ranking] = await Promise.all([
    getLeagueBySlug(slug),
    getCurrentRankingByLeagueSlug(slug),
  ]);

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

        <p className="mt-4 max-w-2xl text-[var(--color-muted)]">
          {league.description}
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">
            Ranking y temporadas
          </h2>

          <p className="mt-2 text-[var(--color-muted)]">
            Consulta la clasificación vigente de esta liga.
          </p>

          <div className="mt-6">
            {ranking ? (
              <RankingTable ranking={ranking} />
            ) : (
              <p className="rounded-2xl border border-[var(--color-border)] bg-white p-6 text-[var(--color-muted)] shadow-sm">
                Esta liga todavía no tiene una clasificación publicada.
              </p>
            )}
          </div>
        </section>
      </Container>
    </main>
  );
}