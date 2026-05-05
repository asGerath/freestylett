// Card visual de un post.
// Navega al detalle usando el slug.

import Link from "next/link";
import type { BlogPost } from "../types/blog.types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <Card>
        <Badge variant="accent">{post.category}</Badge>
        <h3 className="mt-2 text-xl font-bold">{post.title}</h3>

        <p className="mt-3 text-sm text-gray-400">{post.excerpt}</p>

        <p className="mt-4 text-xs text-gray-500">{post.publishedAt}</p>
      </Card>
    </Link>
  );
}