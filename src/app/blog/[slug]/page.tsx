import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { getBlogPostBySlug } from "@/features/blog/services/blog.service";

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Artículo no encontrado",
      description: "El artículo solicitado no está disponible.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalPath = `/blog/${post.slug}`;
  const image = "/images/brand/logo-primary.webp";

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "article",
      title: `${post.title} | Freestyle Total`,
      description: post.excerpt,
      url: canonicalPath,
      publishedTime: post.publishedAt,
      images: [
        {
          url: image,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Freestyle Total`,
      description: post.excerpt,
      images: [image],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="py-10">
      <Container>
        <span className="text-sm font-bold text-[var(--color-accent)]">
          {post.category}
        </span>

        <h1 className="mt-3 max-w-3xl text-4xl font-bold">
          {post.title}
        </h1>

        <p className="mt-3 text-sm text-gray-500">
          {new Intl.DateTimeFormat("es-MX", {
            dateStyle: "long",
          }).format(new Date(post.publishedAt))}
        </p>

        <article className="mt-8 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-lg text-gray-400">{post.excerpt}</p>

          {post.contentMarkdown && (
            <div className="mt-6 whitespace-pre-wrap text-gray-300">
              {post.contentMarkdown}
            </div>
          )}
        </article>
      </Container>
    </main>
  );
}