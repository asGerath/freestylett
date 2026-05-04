// Importamos el contenedor base de layout
import { Container } from "@/components/ui/Container";

import { FreestylersPreview } from "@/features/freestylers/components/FreestylersPreview";
import { LeaguesPreview } from "@/features/leagues/components/LeaguesPreview";
import { BlogPreview } from "@/features/blog/components/BlogPreview";

// Importamos el preview de eventos para el Home
import { EventsPreview } from "@/features/events/components/EventsPreview";

export default function HomePage() {
  return (
    <main className="py-10">
      {/* Container controla ancho máximo y padding horizontal */}
      <Container>
        {/* Hero principal del Home */}
        <section>
          <h1 className="text-4xl font-bold">Freestyle Total</h1>

          <p className="mt-3 max-w-2xl text-gray-400">
            Eventos, ligas, rankings y freestylers del ecosistema freestyle.
          </p>
        </section>

        {/* Preview de eventos, no la sección completa */}
        <EventsPreview />
        <FreestylersPreview />
        <LeaguesPreview />
        <BlogPreview />
      </Container>
    </main>
  );
}