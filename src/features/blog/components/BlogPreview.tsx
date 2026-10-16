import { SectionHeader } from "@/components/ui/SectionHeader";
import { getFeaturedBlogPosts } from "../services/blog.service";
import { BlogCard } from "./BlogCard";

export async function BlogPreview() {
  const posts = await getFeaturedBlogPosts(3);

  return (
    <section className="mt-16">
      <SectionHeader
        title="Blog"
        description="Noticias, resúmenes y análisis del ecosistema freestyle."
        href="/blog"
        linkLabel="Ver todos los posts →"
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}