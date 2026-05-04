// Página completa de eventos (NO preview)

import { Container } from "@/components/ui/Container";
import { EventsSection } from "@/features/events/components/EventsSection";

export default function EventsPage() {
  return (
    <main className="py-10">
      <Container>
        <h1 className="text-4xl font-bold">Eventos</h1>

        <p className="mt-3 text-gray-400">
          Explora todos los eventos del ecosistema freestyle.
        </p>

        {/* Aquí va TODO */}
        <EventsSection />
      </Container>
    </main>
  );
}