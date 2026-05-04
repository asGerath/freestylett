import type { BlogPost } from "../types/blog.types";

export const blogMock: BlogPost[] = [
  {
    id: "1",
    title: "Resumen de la última jornada de FMS México",
    slug: "resumen-fms-mexico-jornada",
    excerpt: "Lo más relevante de la jornada, mejores batallas y movimientos en la tabla.",
    category: "Resumen",
    publishedAt: "2026-06-20",
  },
  {
    id: "2",
    title: "Freestylers a seguir esta temporada",
    slug: "freestylers-a-seguir-temporada",
    excerpt: "Una selección de competidores que pueden romperla este año.",
    category: "Opinión",
    publishedAt: "2026-06-25",
  },
  {
    id: "3",
    title: "Cómo se está moviendo el circuito internacional",
    slug: "circuito-internacional-freestyle",
    excerpt: "Eventos, ligas y marcas que están marcando el rumbo del freestyle.",
    category: "Noticia",
    publishedAt: "2026-07-01",
  },
];