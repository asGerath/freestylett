// Card visual de un post.
// Navega al detalle usando el slug.

import Link from "next/link";
import type { BlogPost } from "../types/blog.types";

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <article className="h-full rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-[var(--color-accent)] hover:bg-white/10">
        <span className="text-sm text-[var(--color-accent)]">
          {post.category}
        </span>

        <h3 className="mt-2 text-xl font-bold">{post.title}</h3>

        <p className="mt-3 text-sm text-gray-400">{post.excerpt}</p>

        <p className="mt-4 text-xs text-gray-500">{post.publishedAt}</p>
      </article>
    </Link>
  );
}