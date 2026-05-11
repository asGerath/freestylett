// Card visual para mostrar información resumida de un evento.
// Usa componentes reutilizables como Card y Badge.

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { EventItem } from "../types/event.types";
import Image from "next/image";

type EventCardProps = {
  event: EventItem;
};

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/eventos/${event.slug}`} className="block">
      <Card>
        {event.posterUrl && (
  <div className="mb-5 overflow-hidden rounded-xl bg-white/10">
    <Image
      src={event.posterUrl}
      alt={event.title}
      width={600}
      height={400}
      className="h-44 w-full object-cover"
    />
  </div>
)}
        {/* Header: liga y estado */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-[var(--color-accent)]">
            {event.league}
          </span>

          <Badge>{event.status}</Badge>
        </div>

        {/* Body: título y ubicación */}
        <div className="mt-5">
          <h3 className="text-xl font-bold leading-tight">
            {event.title}
          </h3>

          <p className="mt-2 text-sm text-gray-400">
            {event.city}, {event.country}
          </p>
        </div>

        {/* Footer: fecha, hora y venue */}
        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="text-sm text-gray-300">
            {event.date} · {event.time}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {event.venue}
          </p>
        </div>

      </Card>
    </Link>
  );
}