import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminBlogPostForm } from "@/features/blog/components/AdminBlogPostForm";
import {
  getAdminBlogPostById,
  getAdminBlogPostFormOptions,
} from "@/features/blog/services/admin-blog.service";

type EditArticlePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditArticlePage({
  params,
  searchParams,
}: EditArticlePageProps) {
  const { id } = await params;

  const [article, options, query] =
    await Promise.all([
      getAdminBlogPostById(id),
      getAdminBlogPostFormOptions(),
      searchParams,
    ]);

  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <Link
        href="/admin/articulos"
        className="text-sm font-bold text-[var(--color-primary)]"
      >
        ← Volver a artículos
      </Link>

      <header className="mt-6">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Panel editorial
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Editar artículo
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          Modifica el contenido de {article.title}.
        </p>
      </header>

      {query.error && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700"
        >
          {query.error}
        </div>
      )}

      {options.categories.length === 0 ? (
        <div
          role="alert"
          className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800"
        >
          No existen categorías editoriales. Registra al
          menos una categoría antes de editar artículos.
        </div>
      ) : (
        <AdminBlogPostForm
          categories={options.categories}
          initialValues={article}
        />
      )}
    </main>
  );
}