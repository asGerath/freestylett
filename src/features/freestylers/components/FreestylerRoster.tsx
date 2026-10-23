"use client";

import { useMemo, useState } from "react";

import { FreestylerCard } from "./FreestylerCard";
import type { FreestylerItem } from "../types/freestyler.types";

type Props = {
  freestylers: FreestylerItem[];
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

export function FreestylerRoster({ freestylers }: Props) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("all");

  const countries = useMemo(
    () =>
      Array.from(new Set(freestylers.map((freestyler) => freestyler.country)))
        .sort((first, second) => first.localeCompare(second, "es")),
    [freestylers],
  );

  const filteredFreestylers = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    return freestylers.filter((freestyler) => {
      const searchableText = normalize(
        [
          freestyler.name,
          freestyler.aka,
          freestyler.city,
          freestyler.country,
        ]
          .filter(Boolean)
          .join(" "),
      );

      const matchesQuery =
        normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);
      const matchesCountry =
        country === "all" || freestyler.country === country;

      return matchesQuery && matchesCountry;
    });
  }, [country, freestylers, query]);

  const hasActiveFilters = query.trim().length > 0 || country !== "all";

  function clearFilters() {
    setQuery("");
    setCountry("all");
  }

  return (
    <section aria-labelledby="roster-title">
      <div className="border-b border-[var(--color-border)] pb-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Competidores
            </p>
            <h1
              id="roster-title"
              className="mt-1 text-4xl font-black tracking-tight text-[var(--color-foreground)]"
            >
              Roster de freestylers
            </h1>
            <p className="mt-2 max-w-2xl text-[var(--color-muted)]">
              Explora los perfiles publicados y encuentra competidores por
              nombre, AKA o país.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(16rem,1fr)_13rem] xl:w-[36rem]">
            <label className="relative block">
              <span className="sr-only">Buscar freestyler</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-muted)]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nombre o AKA"
                className="h-12 w-full rounded-full border border-[var(--color-border)] bg-white pl-12 pr-4 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-cyan-100"
              />
            </label>

            <label className="relative block">
              <span className="sr-only">Filtrar por país</span>
              <select
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                className="h-12 w-full appearance-none rounded-full border border-[var(--color-border)] bg-white px-5 pr-10 text-sm font-semibold outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-cyan-100"
              >
                <option value="all">Todos los países</option>
                {countries.map((countryOption) => (
                  <option key={countryOption} value={countryOption}>
                    {countryOption}
                  </option>
                ))}
              </select>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-[var(--color-muted)]" aria-live="polite">
          {filteredFreestylers.length}{" "}
          {filteredFreestylers.length === 1 ? "perfil encontrado" : "perfiles encontrados"}
        </p>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-bold text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            Limpiar filtros
          </button>
        ) : null}
      </div>

      {filteredFreestylers.length > 0 ? (
        <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredFreestylers.map((freestyler) => (
            <FreestylerCard key={freestyler.id} freestyler={freestyler} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-[var(--color-border)] bg-white px-6 py-14 text-center">
          <h2 className="text-xl font-black">No encontramos coincidencias</h2>
          <p className="mt-2 text-[var(--color-muted)]">
            Prueba con otro nombre o cambia el país seleccionado.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
          >
            Ver todo el roster
          </button>
        </div>
      )}
    </section>
  );
}
