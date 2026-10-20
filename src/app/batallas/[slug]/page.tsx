import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { getPublishedBattleBySlug } from "@/features/battles/services/battle.service";
import type { BattleItem } from "@/features/battles/types/battle.types";

type BattleDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000"
).replace(/\/$/, "");

const statusLabels: Record<BattleItem["status"], string> = {
  scheduled: "Programada",
  live: "En vivo",
  finished: "Finalizada",
  cancelled: "Cancelada",
  postponed: "Pospuesta",
};

const stageLabels: Record<BattleItem["stage"], string> = {
  group_stage: "Fase de grupos",
  play_in: "Play-in",
  round_of_32: "Treintaidosavos",
  round_of_16: "Octavos de final",
  quarterfinal: "Cuartos de final",
  semifinal: "Semifinal",
  third_place: "Tercer lugar",
  final: "Final",
  regular_round: "Jornada regular",
  exhibition: "Exhibición",
  other: "Otra fase",
};

const decisionLabels: Record<
  NonNullable<BattleItem["decisionType"]>,
  string
> = {
  direct: "Victoria directa",
  replica: "Victoria tras réplica",
  jury: "Decisión del jurado",
  technical: "Decisión técnica",
  walkover: "Walkover",
  draw: "Empate",
};

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date(value));
}

export async function generateMetadata({
  params,
}: BattleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const battle = await getPublishedBattleBySlug(slug);

  if (!battle) {
    return {
      title: "Batalla no encontrada",
      description: "La batalla solicitada no está disponible.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const participantNames = battle.participants
    .map(
      (participant) =>
        participant.freestyler.stageName,
    )
    .join(" vs ");

  const description = participantNames
    ? `${participantNames} en ${battle.event.title}. Consulta el resultado y los detalles en Freestyle Total.`
    : `${battle.title}. Consulta los detalles de esta batalla en Freestyle Total.`;

  const canonicalPath = `/batallas/${battle.slug}`;

  return {
    title: battle.title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "article",
      title: `${battle.title} | Freestyle Total`,
      description,
      url: canonicalPath,
      images: [
        {
          url: "/images/brand/logo-primary.webp",
          alt: battle.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${battle.title} | Freestyle Total`,
      description,
      images: ["/images/brand/logo-primary.webp"],
    },
  };
}

export default async function BattleDetailPage({
  params,
}: BattleDetailPageProps) {
  const { slug } = await params;
  const battle = await getPublishedBattleBySlug(slug);

  if (!battle) {
    notFound();
  }

  const sides = Array.from(
    new Set(
      battle.participants.map(
        (participant) => participant.sideNumber,
      ),
    ),
  ).sort((first, second) => first - second);

  const battleUrl = `${siteUrl}/batallas/${battle.slug}`;

  const battleJsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: battle.title,
    url: battleUrl,
    startDate: battle.event.startsAt,
    location: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: battle.event.city,
        addressCountry: battle.event.country,
      },
    },
    competitor: battle.participants.map(
      (participant) => ({
        "@type": "Person",
        name: participant.freestyler.stageName,
        url: `${siteUrl}/freestylers/${participant.freestyler.slug}`,
      }),
    ),
    superEvent: {
      "@type": "Event",
      name: battle.event.title,
      url: `${siteUrl}/eventos/${battle.event.slug}`,
    },
  };

  return (
    <main className="py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(battleJsonLd).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      <Container>
        <Link
          href="/batallas"
          className="font-bold text-[var(--color-primary)] hover:underline"
        >
          ← Volver a batallas
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <section>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              {stageLabels[battle.stage]}
            </p>

            <h1 className="mt-3 text-4xl font-black">
              {battle.title}
            </h1>

            <p className="mt-4 text-[var(--color-muted)]">
              {battle.event.title}
              {" · "}
              {formatEventDate(battle.event.startsAt)}
            </p>

            {sides.length > 0 ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {sides.map((sideNumber) => {
                  const participants =
                    battle.participants.filter(
                      (participant) =>
                        participant.sideNumber ===
                        sideNumber,
                    );

                  const isWinner =
                    battle.winnerSide === sideNumber;

                  return (
                    <article
                      key={sideNumber}
                      className={`rounded-3xl border p-6 shadow-sm ${
                        isWinner
                          ? "border-[var(--color-primary)] bg-cyan-50"
                          : "border-[var(--color-border)] bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                          Lado {sideNumber}
                        </p>

                        {isWinner && (
                          <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-bold text-white">
                            Ganador
                          </span>
                        )}
                      </div>

                      <div className="mt-5 space-y-5">
                        {participants.map(
                          (participant) => (
                            <div
                              key={participant.id}
                              className="flex items-center justify-between gap-4"
                            >
                              <div>
                                <Link
                                  href={`/freestylers/${participant.freestyler.slug}`}
                                  className="text-xl font-black hover:text-[var(--color-primary)]"
                                >
                                  {
                                    participant.freestyler
                                      .stageName
                                  }
                                </Link>

                                <p className="mt-1 text-sm text-[var(--color-muted)]">
                                  {
                                    participant.freestyler
                                      .country
                                  }
                                </p>
                              </div>

                              {participant.score !== null && (
                                <span className="text-2xl font-black">
                                  {participant.score}
                                </span>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-6 text-[var(--color-muted)]">
                Los participantes todavía no han sido
                publicados.
              </p>
            )}
          </section>

          <aside className="h-fit rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">
              Detalles
            </h2>

            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-[var(--color-muted)]">
                  Estado
                </dt>
                <dd className="font-bold">
                  {statusLabels[battle.status]}
                </dd>
              </div>

              <div>
                <dt className="text-[var(--color-muted)]">
                  Resultado
                </dt>
                <dd className="font-bold">
                  {battle.decisionType
                    ? decisionLabels[battle.decisionType]
                    : "Pendiente"}
                </dd>
              </div>

              <div>
                <dt className="text-[var(--color-muted)]">
                  Evento
                </dt>
                <dd>
                  <Link
                    href={`/eventos/${battle.event.slug}`}
                    className="font-bold text-[var(--color-primary)] hover:underline"
                  >
                    {battle.event.title}
                  </Link>
                </dd>
              </div>

              {battle.league && (
                <div>
                  <dt className="text-[var(--color-muted)]">
                    Liga
                  </dt>
                  <dd>
                    <Link
                      href={`/ligas/${battle.league.slug}`}
                      className="font-bold text-[var(--color-primary)] hover:underline"
                    >
                      {battle.league.name}
                    </Link>
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-[var(--color-muted)]">
                  Ubicación
                </dt>
                <dd className="font-bold">
                  {battle.event.city},{" "}
                  {battle.event.country}
                </dd>
              </div>
            </dl>

            <div className="mt-6 space-y-3">
              {battle.videoUrl && (
                <a
                  href={battle.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-full bg-[var(--color-primary)] px-5 py-3 text-center font-bold text-white"
                >
                  Ver video
                </a>
              )}

              <a
                href={battle.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="block rounded-full border border-[var(--color-border)] px-5 py-3 text-center font-bold"
              >
                Fuente oficial
              </a>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}