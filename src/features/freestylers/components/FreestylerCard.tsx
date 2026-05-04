// Card visual de freestyler.
// Igual que EventCard, pero para perfiles.

import Link from "next/link";
import type { FreestylerItem } from "../types/freestyler.types";

type Props = {
  freestyler: FreestylerItem;
};

export function FreestylerCard({ freestyler }: Props) {
  return (
    <Link href={`/freestylers/${freestyler.slug}`} className="block">
      <article className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-[var(--color-accent)]">
        
        {/* Nombre */}
        <h3 className="text-xl font-bold">{freestyler.name}</h3>

        {/* País */}
        <p className="mt-2 text-sm text-gray-400">
          {freestyler.city}, {freestyler.country}
        </p>
      </article>
    </Link>
  );
}