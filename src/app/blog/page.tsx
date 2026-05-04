// Página completa del blog.

import { Container } from "@/components/ui/Container";
import { blogMock } from "@/features/blog/data/blog.mock";
import { BlogCard } from "@/features/blog/components/BlogCard";

export default function BlogPage() {
  return (
    <main className="py-10">
      <Container>
        <h1 className="text-4xl font-bold">Blog</h1>

        <p className="mt-3 max-w-2xl text-gray-400">
          Noticias, resúmenes de eventos, entrevistas y contenido relevante del
          ecosistema freestyle.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blogMock.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </main>
  );
}