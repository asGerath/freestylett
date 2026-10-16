import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { EventsSection } from "@/features/events/components/EventsSection";
import { getEvents } from "@/features/events/services/event.service";

const description =
  "Consulta próximos eventos, jornadas y competencias del ecosistema freestyle.";

export const metadata: Metadata = {
  title: "Eventos",
  description,

  alternates: {
    canonical: "/eventos",
  },

  openGraph: {
    type: "website",
    title: "Eventos de freestyle | Freestyle Total",
    description,
    url: "/eventos",
    images: [
      {
        url: "/images/brand/logo-primary.webp",
        alt: "Eventos de freestyle en Freestyle Total",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Eventos de freestyle | Freestyle Total",
    description,
    images: ["/images/brand/logo-primary.webp"],
  },
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="py-10">
      <Container>
        <h1 className="text-4xl font-bold">Eventos</h1>

        <p className="mt-3 text-[var(--color-muted)]">
          Explora todos los eventos del ecosistema freestyle.
        </p>

        <EventsSection events={events} />
      </Container>
    </main>
  );
}