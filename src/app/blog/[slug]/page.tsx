import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { getBlogPostBySlug } from "@/features/blog/services/blog.service";

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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