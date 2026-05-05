// Card visual para mostrar la información resumida de un evento.
// Ahora incluye navegación al detalle usando el slug.

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { EventItem } from "../types/event.types";

type EventCardProps = {
  event: EventItem;
};

export function EventCard({ event }: EventCardProps) {
  return (
    // Convertimos toda la card en un link
    <Link href={`/eventos/${event.slug}`} className="block">

      <Card>
        {/* Liga o marca principal del evento */}
        <span className="text-sm text-[var(--color-accent)]">
          {event.league}
        </span>

        {/* Nombre del evento */}
        <h3 className="mt-2 text-xl font-bold">{event.title}</h3>

        {/* Ubicación */}
        <p className="mt-2 text-sm text-gray-400">
          {event.city}, {event.country}
        </p>

        {/* Fecha */}
        <p className="mt-4 text-sm text-gray-300">
          Fecha: {event.date}
        </p>

        {/* Estado */}
        <Badge>{event.status}</Badge>

      </Card>
    </Link>

  );
}