"use client";

// Esta sección maneja filtros en el cliente.
// Por eso usamos "use client", porque necesitamos useState.

import { useMemo, useState } from "react";
import type { Event } from "../types/event.types";
import { EventCard } from "./EventCard";
import { EventsFilters } from "./EventsFilters";

type EventsSectionProps = { events: Event[] };

export function EventsSection({ events }: EventsSectionProps) {
  // Guardamos el país seleccionado
  const [selectedCountry, setSelectedCountry] = useState("all");

  // Guardamos la liga seleccionada
  const [selectedLeague, setSelectedLeague] = useState("all");

  // Obtenemos países únicos desde los datos mock
  const countries = useMemo(() => {
    return [...new Set(events.map((event) => event.country))];
  }, [events]);

  // Obtenemos ligas únicas desde los datos mock
  const leagues = useMemo(() => {
    return [...new Set(events.map((event) => event.league))];
  }, [events]);

  // Filtramos eventos según país y liga seleccionados
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCountry =
        selectedCountry === "all" || event.country === selectedCountry;

      const matchesLeague =
        selectedLeague === "all" || event.league === selectedLeague;

      return matchesCountry && matchesLeague;
    });
  }, [events, selectedCountry, selectedLeague]);

  return (
    <section className="mt-12">
      {/* Encabezado de la sección */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Eventos destacados</h2>

        <p className="mt-2 text-[var(--color-muted)]">
          Batallas, jornadas y competencias relevantes del ecosistema freestyle.
        </p>
      </div>

      {/* Filtros de eventos */}
      <EventsFilters
        selectedCountry={selectedCountry}
        selectedLeague={selectedLeague}
        countries={countries}
        leagues={leagues}
        onCountryChange={setSelectedCountry}
        onLeagueChange={setSelectedLeague}
      />

      {/* Validamos si hay eventos para mostrar */}
      {events.length === 0 ? (
        <p className="rounded-2xl border border-[var(--color-border)] bg-white p-6 text-[var(--color-muted)]">
          Todavía no hay eventos disponibles.
        </p>
      ) : filteredEvents.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-[var(--color-border)] bg-white p-6 text-[var(--color-muted)]">
          No encontramos eventos con estos filtros.
        </p>
      )}
    </section>
  );
}
