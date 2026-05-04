// Preview del blog para el Home.
// Muestra algunos posts y enlaza a la página completa.

import { blogMock } from "../data/blog.mock";
import { BlogCard } from "./BlogCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function BlogPreview() {
  const preview = blogMock.slice(0, 3);

  return (
    <section className="mt-16">
        <SectionHeader
          title="Blog"
          description="Noticias, resúmenes y análisis del ecosistema freestyle."
          href="/blog"
          linkLabel="Ver todos los posts →"
        />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {preview.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}