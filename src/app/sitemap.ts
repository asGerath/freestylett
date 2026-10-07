import type { MetadataRoute } from "next";

import { getEvents } from "@/features/events/services/event.service";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getEvents();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/eventos`,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${siteUrl}/eventos/${event.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...eventRoutes];
}