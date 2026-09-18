// Temporary demonstration data. The UI consumes it through the event
// repository so this provider can later be replaced by Supabase.

import type { Event } from "../types/event.types";

export const eventsMock: Event[] = [
  {
    id: "event-fms-mexico-j1",
    title: "FMS México Jornada 1",
    slug: "fms-mexico-jornada-1",
    description: "Jornada de freestyle con competidores, host y DJ invitados.",
    country: "México",
    city: "CDMX",
    league: "FMS México",
    startsAt: "2026-06-15T20:00:00-06:00",
    timeZone: "America/Mexico_City",
    status: "finished",
    venue: "Pepsi Center WTC",
    posterUrl: "/images/events/PP-fms.webp",
    participants: [
      { id: "aczino", name: "Aczino", slug: "aczino", country: "México", role: "competitor" },
      { id: "rapder", name: "Rapder", slug: "rapder", country: "México", role: "competitor" },
      { id: "serko-fu", name: "Serko Fu", country: "México", role: "host" },
      { id: "dj-sonicko", name: "DJ Sonicko", country: "México", role: "dj" },
    ],
  },
  {
    id: "event-red-bull-colombia",
    title: "Red Bull Batalla Colombia",
    slug: "red-bull-batalla-colombia",
    description: "Competencia nacional con representantes de la escena colombiana.",
    country: "Colombia",
    city: "Bogotá",
    league: "Red Bull Batalla",
    startsAt: "2026-07-20T19:00:00-05:00",
    timeZone: "America/Bogota",
    status: "finished",
    venue: "Movistar Arena",
    posterUrl: "/images/events/PP-red-bull.webp",
    participants: [
      { id: "carpediem", name: "Carpediem", slug: "carpediem", country: "Colombia", role: "competitor" },
      { id: "marithea", name: "Marithea", slug: "marithea", country: "Colombia", role: "competitor" },
    ],
  },
  {
    id: "event-god-level-all-stars",
    title: "God Level All Stars",
    slug: "god-level-all-stars",
    description: "Encuentro internacional por equipos con talento de distintos países.",
    country: "Argentina",
    city: "Buenos Aires",
    league: "God Level",
    startsAt: "2026-08-10T18:00:00-03:00",
    timeZone: "America/Argentina/Buenos_Aires",
    status: "finished",
    venue: "Estadio Monumental",
    posterUrl: "/images/events/PP-god-level.webp",
    participants: [
      { id: "stuart", name: "Stuart", slug: "stuart", country: "Argentina", role: "competitor" },
      { id: "kodigo", name: "Kodigo", slug: "kodigo", country: "Argentina", role: "competitor" },
    ],
  },
];
