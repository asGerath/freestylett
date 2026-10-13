import Link from "next/link";

import { AdminBlogPostForm } from "@/features/blog/components/AdminBlogPostForm";
import { getAdminBlogPostFormOptions } from "@/features/blog/services/admin-blog.service";

type NewArticlePageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewArticlePage({
  searchParams,
}: NewArticlePageProps) {
  const [options, params] = await Promise.all([
    getAdminBlogPostFormOptions(),
    searchParams,
  ]);

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
          Crear artículo
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          Publica noticias, resúmenes, crónicas y contenido
          del ecosistema freestyle.
        </p>
      </header>

      {params.error && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700"
        >
          {params.error}
        </div>
      )}

      {options.categories.length === 0 ? (
        <div
          role="alert"
          className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800"
        >
          No existen categorías editoriales. Registra al
          menos una categoría antes de crear artículos.
        </div>
      ) : (
        <AdminBlogPostForm
          categories={options.categories}
        />
      )}
    </main>
  );
}