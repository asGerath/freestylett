// Página de detalle de un evento.
// Next obtiene el slug desde la URL: /eventos/fms-mexico-jornada-1

import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { eventsMock } from "@/features/events/data/events.mock";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";

type EventDetailPageProps = {
  params: {
    slug: string;
  };
};


export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;

  const event = eventsMock.find((event) => event.slug === slug);

  if (!event) {
    notFound();
  }

  return (
    <main className="py-10">
      <Container>

        {event.posterUrl && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <Image
              src={event.posterUrl}
              alt={event.title}
              width={1200}
              height={600}
              className="h-80 w-full object-cover"
              priority
            />
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Columna principal */}
          <section>
            <span className="text-sm font-bold text-[var(--color-accent)]">
              {event.league}
            </span>

            <h1 className="mt-3 text-4xl font-bold">{event.title}</h1>

            <p className="mt-4 max-w-3xl text-gray-400">
              Información general del evento, contexto de la jornada, participantes
              destacados y detalles relevantes para los fans del freestyle.
            </p>
          <section className="mt-8">
  <h2 className="text-2xl font-bold">Participantes</h2>

  <div className="mt-4 grid gap-4 md:grid-cols-2">
    {event.participants.map((participant) => (
      <article
        key={participant.id}
        className="rounded-xl border border-white/10 bg-white/5 p-4"
      >
        <p className="font-bold">{participant.name}</p>

        <p className="mt-1 text-sm text-gray-400">
          {participant.country ?? "País no definido"}
        </p>

        <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[var(--color-accent)]">
          {participant.role}
        </p>
      </article>
    ))}
  </div>
          </section>
          </section>


          {/* Sidebar de información rápida */}
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">Detalles del evento</h2>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Fecha</p>
                <p className="font-medium text-gray-200">{event.date}</p>
              </div>

              <div>
                <p className="text-gray-500">Hora</p>
                <p className="font-medium text-gray-200">{event.time}</p>
              </div>

              <div>
                <p className="text-gray-500">Lugar</p>
                <p className="font-medium text-gray-200">{event.venue}</p>
              </div>

              <div>
                <p className="text-gray-500">Ubicación</p>
                <p className="font-medium text-gray-200">
                  {event.city}, {event.country}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Estado</p>
                <div className="mt-2">
                  <Badge>{event.status}</Badge>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}