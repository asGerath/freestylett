// Card visual para mostrar la información resumida de un evento.
// Ahora incluye navegación al detalle usando el slug.

import Link from "next/link";
import type { EventItem } from "../types/event.types";

type EventCardProps = {
  event: EventItem;
};

export function EventCard({ event }: EventCardProps) {
  return (
    // Convertimos toda la card en un link
    <Link href={`/eventos/${event.slug}`} className="block">
      <article className="h-full rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-200 hover:-translate-y-1 hover:border-[var(--color-accent)] hover:bg-white/10">
        
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
        <span className="mt-4 inline-block rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-black">
          {event.status}
        </span>
      </article>
    </Link>
  );
}