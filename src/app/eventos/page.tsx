// Página completa de eventos (NO preview)

import { Container } from "@/components/ui/Container";
import { EventsSection } from "@/features/events/components/EventsSection";
import { getEvents } from "@/features/events/services/event.service";

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <main className="py-10">
      <Container>
        <h1 className="text-4xl font-bold">Eventos</h1>

        <p className="mt-3 text-[var(--color-muted)]">
          Explora todos los eventos del ecosistema freestyle.
        </p>

        {/* Aquí va TODO */}
        <EventsSection events={events} />
      </Container>
    </main>
  );
}
