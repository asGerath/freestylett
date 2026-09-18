import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Event } from "../types/event.types";
import { formatEventDate, formatEventTime } from "../utils/event-date";

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"
    >
      <Card className="p-0">
        {event.posterUrl && (
          <div className="relative overflow-hidden bg-[var(--color-surface-soft)]">
            <Image
              src={event.posterUrl}
              alt={event.title}
              width={600}
              height={400}
              className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent" />
            <span className="absolute bottom-4 left-4 rounded-full bg-[var(--color-accent)] px-3 py-1.5 text-xs font-black text-[var(--color-text-dark)]">
              {formatEventDate(event)}
            </span>
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
              {event.league}
            </span>
            <Badge variant="muted">{event.status}</Badge>
          </div>

          <h3 className="mt-4 text-2xl font-black leading-tight tracking-tight text-[var(--color-text)]">
            {event.title}
          </h3>

          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {event.city}, {event.country}
          </p>

          <div className="mt-6 border-t border-[var(--color-border)] pt-4">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              {formatEventTime(event)}
            </p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {event.venue}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
