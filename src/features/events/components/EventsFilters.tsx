// Este componente muestra los filtros disponibles para eventos.
// Recibe el estado actual y funciones para actualizar país y liga.

type EventsFiltersProps = {
  selectedCountry: string;
  selectedLeague: string;
  countries: string[];
  leagues: string[];
  onCountryChange: (country: string) => void;
  onLeagueChange: (league: string) => void;
};

export function EventsFilters({
  selectedCountry,
  selectedLeague,
  countries,
  leagues,
  onCountryChange,
  onLeagueChange,
}: EventsFiltersProps) {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2">
      {/* Filtro por país */}
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-[var(--color-text)]">País</span>

        <select
          value={selectedCountry}
          onChange={(event) => onCountryChange(event.target.value)}
          className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
        >
          <option value="all">Todos los países</option>

          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </label>

      {/* Filtro por liga */}
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-[var(--color-text)]">Liga</span>

        <select
          value={selectedLeague}
          onChange={(event) => onLeagueChange(event.target.value)}
          className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
        >
          <option value="all">Todas las ligas</option>

          {leagues.map((league) => (
            <option key={league} value={league}>
              {league}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
