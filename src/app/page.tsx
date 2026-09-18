import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FreestylersPreview } from "@/features/freestylers/components/FreestylersPreview";
import { LeaguesPreview } from "@/features/leagues/components/LeaguesPreview";
import { BlogPreview } from "@/features/blog/components/BlogPreview";
import { EventsPreview } from "@/features/events/components/EventsPreview";
import { eventsMock } from "@/features/events/data/events.mock";

const sceneStats = [
  { value: "5", label: "países conectados" },
  { value: "24/7", label: "actualidad freestyle" },
  { value: "1", label: "escena sin fronteras" },
];

export default function HomePage() {
  const featuredEvent = eventsMock[0];

  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-[var(--color-border)] py-10 sm:py-14 lg:py-20">
        <div className="pointer-events-none absolute -left-32 top-0 size-96 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-[var(--color-accent)]/5 blur-3xl" />

        <Container>
          <div className="grid items-stretch gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div className="flex flex-col justify-center py-4 lg:py-10">
              <span className="w-fit rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-primary-soft)]">
                La cultura habla aquí
              </span>

              <h1 className="mt-7 max-w-2xl text-5xl font-black leading-[0.95] tracking-[-0.05em] text-[var(--color-text)] sm:text-6xl lg:text-7xl">
                TODO EL
                <span className="block text-[var(--color-primary)]">
                  FREESTYLE.
                </span>
                UNA SOLA ESCENA.
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--color-muted)]">
                Sigue eventos, ligas, rankings y protagonistas del freestyle
                hispano con información conectada y fácil de explorar.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/eventos"
                  className="rounded-full bg-[var(--color-primary)] px-6 py-3.5 text-center text-sm font-black text-[var(--color-text-dark)] transition hover:bg-[var(--color-primary-soft)]"
                >
                  EXPLORAR EVENTOS
                </Link>
                <Link
                  href="/freestylers"
                  className="rounded-full border border-[var(--color-border)] bg-white px-6 py-3.5 text-center text-sm font-black text-[var(--color-text)] shadow-sm transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  VER FREESTYLERS
                </Link>
              </div>
            </div>

            {featuredEvent && (
              <Link
                href={`/eventos/${featuredEvent.slug}`}
                className="group relative min-h-[470px] overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_35px_100px_rgba(1,12,18,0.45)]"
              >
                {featuredEvent.posterUrl && (
                  <Image
                    src={featuredEvent.posterUrl}
                    alt={featuredEvent.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071219] via-[#071219]/45 to-transparent" />

                <div className="absolute left-5 top-5 rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-text-dark)] sm:left-7 sm:top-7">
                  Próximo evento
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-primary-soft)]">
                    {featuredEvent.league} · {featuredEvent.date}
                  </p>
                  <h2 className="mt-3 text-4xl font-black leading-none tracking-[-0.04em] text-white sm:text-5xl">
                    {featuredEvent.title}
                  </h2>
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75">
                    <span>
                      {featuredEvent.city}, {featuredEvent.country}
                    </span>
                    <span>{featuredEvent.time}</span>
                    <span>{featuredEvent.venue}</span>
                  </div>
                </div>
              </Link>
            )}
          </div>

          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-3 lg:mt-14">
            {sceneStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[var(--color-surface)] px-6 py-6 sm:px-8"
              >
                <p className="text-3xl font-black text-[var(--color-primary)]">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container>
        <EventsPreview />
      </Container>

      <section className="mt-20 border-y border-[var(--color-border)] bg-[var(--color-surface-soft)] py-4 text-[var(--color-text-dark)] sm:py-10">
        <Container>
          <div className="[&_h2]:text-[var(--color-text-dark)] [&_h3]:text-[var(--color-text-dark)] [&_p]:text-[#48626d] [&_article]:border-[#0b1820]/10 [&_article]:bg-white [&_article]:shadow-[0_20px_60px_rgba(11,24,32,0.12)] [&_article:hover]:bg-[#f4fbfd]">
            <FreestylersPreview />
          </div>
        </Container>
      </section>

      <Container>
        <LeaguesPreview />
      </Container>

      <section className="mt-20 border-y border-[var(--color-border)] bg-white/60 py-4 sm:py-10">
        <Container>
          <BlogPreview />
        </Container>
      </section>

      <Container>
        <section className="mt-20 overflow-hidden rounded-[2rem] border border-[var(--color-primary)]/25 bg-gradient-to-r from-[#193542] to-[var(--color-bg-deep)] px-6 py-10 sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14 lg:py-14">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-accent)]">
              FreeStyle Total
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl">
              La escena cambia cada semana. Aquí no te pierdes ninguna batalla.
            </h2>
          </div>
          <Link
            href="/eventos"
            className="mt-7 inline-flex rounded-full bg-[var(--color-primary)] px-6 py-3.5 text-sm font-black text-[var(--color-text-dark)] transition hover:bg-[var(--color-primary-soft)] lg:mt-0"
          >
            VER CALENDARIO
          </Link>
        </section>
      </Container>
    </main>
  );
}
