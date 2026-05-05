// Página de detalle de un post.
// Next obtiene el slug desde la URL: /blog/resumen-fms-mexico-jornada

import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { blogMock } from "@/features/blog/data/blog.mock";

type BlogDetailPageProps = {
  params: {
    slug: string;
  };
};

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  const post = blogMock.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="py-10">
      <Container>
        <span className="text-sm font-bold text-[var(--color-accent)]">
          {post.category}
        </span>

        <h1 className="mt-3 max-w-3xl text-4xl font-bold">{post.title}</h1>

        <p className="mt-3 text-sm text-gray-500">{post.publishedAt}</p>

        <section className="mt-8 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-gray-400">{post.excerpt}</p>

          <p className="mt-4 text-gray-400">
            Aquí irá el contenido completo del artículo cuando conectemos el CMS
            o la base de datos.
          </p>
        </section>
      </Container>
    </main>
  );
}