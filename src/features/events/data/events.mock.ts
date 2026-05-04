// Datos temporales para construir la interfaz sin depender todavía del backend.
// Después estos datos vendrán desde Supabase.

import type { EventItem } from "../types/event.types";

export const eventsMock: EventItem[] = [
  {
    id: "1",
    title: "FMS México Jornada 1",
    slug: "fms-mexico-jornada-1",
    country: "México",
    city: "CDMX",
    league: "FMS México",
    date: "2026-06-15",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Red Bull Batalla Colombia",
    slug: "red-bull-batalla-colombia",
    country: "Colombia",
    city: "Bogotá",
    league: "Red Bull Batalla",
    date: "2026-07-20",
    status: "upcoming",
  },
  {
    id: "3",
    title: "God Level All Stars",
    slug: "god-level-all-stars",
    country: "Argentina",
    city: "Buenos Aires",
    league: "God Level",
    date: "2026-08-10",
    status: "upcoming",
  },
  {
    id: "4",
    title: "FMS México Jornada 1",
    slug: "fms-mexico-jornada-1",
    country: "México",
    city: "CDMX",
    league: "FMS México",
    date: "2026-06-15",
    status: "upcoming",
  },
  {
    id: "5",
    title: "Red Bull Batalla Colombia",
    slug: "red-bull-batalla-colombia",
    country: "Colombia",
    city: "Bogotá",
    league: "Red Bull Batalla",
    date: "2026-07-20",
    status: "upcoming",
  },
  {
    id: "6",
    title: "God Level All Stars",
    slug: "god-level-all-stars",
    country: "Argentina",
    city: "Buenos Aires",
    league: "God Level",
    date: "2026-08-10",
    status: "upcoming",
  },
];