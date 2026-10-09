import type { Metadata } from "next";

import { getBlogPosts } from "@/features/blog/services/blog.service";
import { Container } from "@/components/ui/Container";
import { BlogCard } from "@/features/blog/components/BlogCard";

const description =
  "Noticias, resúmenes, entrevistas y análisis del ecosistema freestyle.";

export const metadata: Metadata = {
  title: "Blog",
  description,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    title: "Blog de freestyle | Freestyle Total",
    description,
    url: "/blog",
    images: [
      {
        url: "/images/brand/logo-primary.webp",
        alt: "Blog de Freestyle Total",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog de freestyle | Freestyle Total",
    description,
    images: ["/images/brand/logo-primary.webp"],
  },
};


export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="py-10">
      <Container>
        <h1 className="text-4xl font-bold">Blog</h1>

        <p className="mt-3 max-w-2xl text-gray-400">
          Noticias, resúmenes de eventos, entrevistas y contenido relevante del
          ecosistema freestyle.
        </p>

        {posts.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-[var(--color-border)] bg-white p-6 text-[var(--color-muted)]">
            Todavía no hay artículos publicados.
          </p>
        )}

      </Container>
    </main>
  );
}