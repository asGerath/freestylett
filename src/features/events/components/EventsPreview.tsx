// Preview de eventos para el Home.
// Muestra solo algunos eventos destacados y manda al usuario a la página completa.

import { SectionHeader } from "@/components/ui/SectionHeader";
import { getFeaturedEvents } from "../services/event.service";
import { EventCard } from "./EventCard";

export async function EventsPreview() {
  // Tomamos solo los primeros 3 eventos para no saturar el Home
  const previewEvents = await getFeaturedEvents(3);

  return (
    <section className="mt-12">
      {/* Encabezado reutilizable de la sección preview */}
      <SectionHeader
        title="Eventos destacados"
        description="Una vista rápida de los eventos más relevantes del freestyle."
        href="/eventos"
        linkLabel="Ver todos los eventos →"
      />

      {/* Grid de eventos preview */}
      {previewEvents.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {previewEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-[var(--color-border)] bg-white p-6 text-[var(--color-muted)]">
          Todavía no hay eventos disponibles.
        </p>
      )}
    </section>
  );
}
