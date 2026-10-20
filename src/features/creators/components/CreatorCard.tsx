import Link from "next/link";

import type { CreatorItem } from "../types/creator.types";

const typeLabels = {
  person: "Persona",
  channel: "Canal",
  media: "Medio",
};

export function CreatorCard({
  creator,
}: {
  creator: CreatorItem;
}) {
  const location = [creator.city, creator.country]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      href={`/creadores/${creator.slug}`}
      className="group overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-md"
    >
      <div
        className="aspect-[16/9] bg-[var(--color-surface-soft)] bg-cover bg-center"
        style={
          creator.imageUrl
            ? { backgroundImage: `url("${creator.imageUrl}")` }
            : undefined
        }
      >
        {!creator.imageUrl && (
          <div className="flex h-full items-center justify-center text-5xl font-black text-[var(--color-primary)]">
            {creator.name.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--color-primary-bright)] px-3 py-1 text-xs font-bold">
            {typeLabels[creator.type]}
          </span>
          {creator.isFeatured && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              Destacado
            </span>
          )}
        </div>

        <h2 className="mt-4 text-xl font-black group-hover:text-[var(--color-primary)]">
          {creator.name}
        </h2>

        {creator.handle && (
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {creator.handle}
          </p>
        )}

        {location && (
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            {location}
          </p>
        )}

        {creator.specialties.length > 0 && (
          <p className="mt-3 text-sm">
            {creator.specialties.slice(0, 3).join(" · ")}
          </p>
        )}
      </div>
    </Link>
  );
}
