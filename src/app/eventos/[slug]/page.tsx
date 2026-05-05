// Página de detalle de un evento.
// Next obtiene el slug desde la URL: /eventos/fms-mexico-jornada-1

import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { eventsMock } from "@/features/events/data/events.mock";

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
        <span className="text-sm font-bold text-[var(--color-accent)]">
          {event.league}
        </span>

        <h1 className="mt-3 text-4xl font-bold">{event.title}</h1>

        <p className="mt-4 text-gray-400">
          {event.city}, {event.country}
        </p>

        <p className="mt-2 text-gray-300">
          Fecha: {event.date} · {event.time}
        </p>

        <p className="mt-2 text-gray-400">
          Venue: {event.venue}
        </p>

        <span className="mt-6 inline-block rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-black">
          {event.status}
        </span>
      </Container>
    </main>
  );
}