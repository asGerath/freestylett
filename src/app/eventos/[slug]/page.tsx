import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { getEventBySlug } from "@/features/events/services/event.service";
import { formatEventDate, formatEventTime } from "@/features/events/utils/event-date";

type EventDetailPageProps = { params: Promise<{ slug: string }> };

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  return (
    <main className="py-10">
      <Container>
        {event.posterUrl && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
            <Image src={event.posterUrl} alt={event.title} width={1200} height={600} className="h-80 w-full object-cover" priority />
          </div>
        )}
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <section>
            <span className="text-sm font-bold text-[var(--color-primary)]">{event.league}</span>
            <h1 className="mt-3 text-4xl font-bold">{event.title}</h1>
            <p className="mt-4 max-w-3xl text-[var(--color-muted)]">{event.description ?? "Información general del evento."}</p>
            <section className="mt-8">
              <h2 className="text-2xl font-bold">Participantes</h2>
              {event.participants.length > 0 ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {event.participants.map((participant) => (
                    <article key={`${participant.id}-${participant.role}`} className="rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
                      <p className="font-bold">{participant.name}</p>
                      <p className="mt-1 text-sm text-[var(--color-muted)]">{participant.country ?? "País no definido"}</p>
                      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[var(--color-primary)]">{participant.role}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-xl border border-[var(--color-border)] bg-white p-5 text-[var(--color-muted)]">Los participantes todavía no han sido anunciados.</p>
              )}
            </section>
          </section>
          <aside className="h-fit rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Detalles del evento</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div><dt className="text-[var(--color-muted)]">Fecha</dt><dd className="font-medium">{formatEventDate(event)}</dd></div>
              <div><dt className="text-[var(--color-muted)]">Hora local</dt><dd className="font-medium">{formatEventTime(event)}</dd></div>
              <div><dt className="text-[var(--color-muted)]">Lugar</dt><dd className="font-medium">{event.venue}</dd></div>
              <div><dt className="text-[var(--color-muted)]">Ubicación</dt><dd className="font-medium">{event.city}, {event.country}</dd></div>
              <div><dt className="text-[var(--color-muted)]">Estado</dt><dd className="mt-2"><Badge>{event.status}</Badge></dd></div>
            </dl>
          </aside>
        </div>
      </Container>
    </main>
  );
}
