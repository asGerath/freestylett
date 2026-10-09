import type { MetadataRoute } from "next";

import { getEvents } from "@/features/events/services/event.service";
import { getFreestylers } from "@/features/freestylers/services/freestyler.service";
import { getLeagues } from "@/features/leagues/services/league.service";
import { getBlogPosts } from "@/features/blog/services/blog.service";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const [events, leagues, freestylers, posts] = await Promise.all([
    getEvents(),
    getLeagues(),
    getFreestylers(),
    getBlogPosts(),
  ]);

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
    {
      url: `${siteUrl}/ligas`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/freestylers`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${siteUrl}/eventos/${event.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const leagueRoutes: MetadataRoute.Sitemap = leagues.map((league) => ({
    url: `${siteUrl}/ligas/${league.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const freestylerRoutes: MetadataRoute.Sitemap = freestylers.map(
    (freestyler) => ({
      url: `${siteUrl}/freestylers/${freestyler.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));


  return [
    ...staticRoutes,
    ...eventRoutes,
    ...leagueRoutes,
    ...freestylerRoutes,
    ...blogRoutes,
  ];
}