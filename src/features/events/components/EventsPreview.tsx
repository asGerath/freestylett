// Preview de eventos para el Home.
// Muestra solo algunos eventos destacados y manda al usuario a la página completa.

import { SectionHeader } from "@/components/ui/SectionHeader";
import { eventsMock } from "../data/events.mock";
import { EventCard } from "./EventCard";

export function EventsPreview() {
  // Tomamos solo los primeros 3 eventos para no saturar el Home
  const previewEvents = eventsMock.slice(0, 3);

  return (
    <section className="mt-12">
      {/* Encabezado reutilizable de la sección preview */}
      <SectionHeader
        title="Próximos eventos"
        description="Una vista rápida de los eventos más relevantes del freestyle."
        href="/eventos"
        linkLabel="Ver todos los eventos →"
      />

      {/* Grid de eventos preview */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {previewEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}