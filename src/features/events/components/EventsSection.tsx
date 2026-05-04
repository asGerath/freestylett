"use client";

// Esta sección maneja filtros en el cliente.
// Por eso usamos "use client", porque necesitamos useState.

import { useMemo, useState } from "react";
import { eventsMock } from "../data/events.mock";
import { EventCard } from "./EventCard";
import { EventsFilters } from "./EventsFilters";

export function EventsSection() {
  // Guardamos el país seleccionado
  const [selectedCountry, setSelectedCountry] = useState("all");

  // Guardamos la liga seleccionada
  const [selectedLeague, setSelectedLeague] = useState("all");

  // Obtenemos países únicos desde los datos mock
  const countries = useMemo(() => {
    return [...new Set(eventsMock.map((event) => event.country))];
  }, []);

  // Obtenemos ligas únicas desde los datos mock
  const leagues = useMemo(() => {
    return [...new Set(eventsMock.map((event) => event.league))];
  }, []);

  // Filtramos eventos según país y liga seleccionados
  const filteredEvents = useMemo(() => {
    return eventsMock.filter((event) => {
      const matchesCountry =
        selectedCountry === "all" || event.country === selectedCountry;

      const matchesLeague =
        selectedLeague === "all" || event.league === selectedLeague;

      return matchesCountry && matchesLeague;
    });
  }, [selectedCountry, selectedLeague]);

  return (
    <section className="mt-12">
      {/* Encabezado de la sección */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Próximos eventos</h2>

        <p className="mt-2 text-gray-400">
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
      {filteredEvents.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-white/10 bg-white/5 p-5 text-gray-400">
          No hay eventos con estos filtros.
        </p>
      )}
    </section>
  );
}