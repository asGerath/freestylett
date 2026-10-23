import Image from "next/image";
import Link from "next/link";

import {
  getCountryVisual,
  getTemporaryFreestylerPhoto,
} from "../data/freestyler-media";
import type { FreestylerItem } from "../types/freestyler.types";

type Props = {
  freestyler: FreestylerItem;
};

export function FreestylerCard({ freestyler }: Props) {
  const temporaryPhoto = getTemporaryFreestylerPhoto(freestyler.slug);
  const photoUrl =
    temporaryPhoto ??
    freestyler.photoUrl ??
    "/images/brand/logo-mark.webp";
  const countryVisual = getCountryVisual(freestyler.country);
  const location = [freestyler.city, freestyler.country]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      href={`/freestylers/${freestyler.slug}`}
      aria-label={`Ver perfil de ${freestyler.name}`}
      className="group flex min-h-44 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
    >
      <div className="relative w-28 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-b from-cyan-50 to-slate-100 sm:w-32">
        <Image
          src={photoUrl}
          alt={temporaryPhoto ? `Foto de ${freestyler.name}` : ""}
          fill
          sizes="(max-width: 640px) 112px, 128px"
          className={
            temporaryPhoto
              ? "object-contain object-bottom transition duration-300 group-hover:scale-[1.03]"
              : "object-contain p-5 opacity-40"
          }
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col px-4 py-2">
        <div className="flex items-center gap-2 text-[0.68rem] font-black uppercase tracking-wide text-[var(--color-primary)]">
          {countryVisual.flagSrc ? (
            <Image
              src={countryVisual.flagSrc}
              alt=""
              width={20}
              height={14}
              className="h-3.5 w-5 rounded-[2px] object-cover"
            />
          ) : (
            <span aria-hidden="true" className="text-base leading-none">
              {countryVisual.emoji}
            </span>
          )}
          <span className="truncate">{freestyler.country}</span>
        </div>

        <h2 className="mt-2 truncate text-xl font-black uppercase tracking-tight text-[var(--color-foreground)]">
          {freestyler.name}
        </h2>

        {freestyler.aka ? (
          <p className="mt-0.5 truncate text-sm text-[var(--color-muted)]">
            AKA: {freestyler.aka}
          </p>
        ) : null}

        <p className="mt-1 truncate text-sm text-[var(--color-muted)]">
          {location}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <span className="rounded-full bg-cyan-50 px-3 py-1 text-[0.68rem] font-black uppercase tracking-wide text-[var(--color-primary)]">
            Competidor
          </span>
          <span className="text-xs font-black uppercase tracking-wide text-[var(--color-primary)]">
            Perfil{" "}
            <span
              aria-hidden="true"
              className="inline-block transition group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
