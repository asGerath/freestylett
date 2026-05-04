// Página de detalle de evento

import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { eventsMock } from "@/features/events/data/events.mock";

export default function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = eventsMock.find((e) => e.slug === params.slug);

  if (!event) return notFound();

  return (
    <main className="py-10">
      <Container>
        <h1 className="text-4xl font-bold">{event.title}</h1>

        <p className="mt-3 text-gray-400">
          {event.city}, {event.country}
        </p>

        <p className="mt-2">Fecha: {event.date}</p>
      </Container>
    </main>
  );
}