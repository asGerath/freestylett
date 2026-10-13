import Link from "next/link";

import { ArchiveBlogPostButton } from "@/features/blog/components/ArchiveBlogPostButton";

import { getAdminBlogPosts } from "@/features/blog/services/admin-blog.service";
import type { BlogEditorialStatus } from "@/features/blog/types/blog.types";

const editorialStatusLabels: Record<
    BlogEditorialStatus,
    string
> = {
    draft: "Borrador",
    published: "Publicado",
    archived: "Archivado",
};

const editorialStatusStyles: Record<
    BlogEditorialStatus,
    string
> = {
    draft: "bg-amber-100 text-amber-800",
    published: "bg-emerald-100 text-emerald-800",
    archived: "bg-slate-200 text-slate-700",
};

type AdminArticlesPageProps = {
    searchParams: Promise<{
        created?: string;
        updated?: string;
        archived?: string;
        error?: string;
    }>;
};

function formatDate(value: string) {
    return new Intl.DateTimeFormat("es-MX", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export default async function AdminArticlesPage({
    searchParams,
}: AdminArticlesPageProps) {
    const [articles, params] = await Promise.all([
        getAdminBlogPosts(),
        searchParams,
    ]);

    const successMessage = params.created
        ? "El artículo fue creado correctamente."
        : params.updated
            ? "El artículo fue actualizado correctamente."
            : params.archived
                ? "El artículo fue archivado correctamente."
                : null;

    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-12">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <Link
                        href="/admin"
                        className="text-sm font-bold text-[var(--color-primary)]"
                    >
                        ← Volver al panel
                    </Link>

                    <p className="mt-6 text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
                        Panel editorial
                    </p>

                    <h1 className="mt-2 text-3xl font-black">
                        Artículos
                    </h1>

                    <p className="mt-2 text-[var(--color-muted)]">
                        Consulta y administra el contenido editorial.
                    </p>
                </div>

                <Link
                    href="/admin/articulos/nuevo"
                    className="inline-flex w-fit items-center justify-center rounded-full bg-[var(--color-primary)] px-5 py-3 font-bold text-white transition hover:opacity-90"
                >
                    Crear artículo
                </Link>
            </div>

            {successMessage && (
                <div
                    role="status"
                    className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800"
                >
                    {successMessage}
                </div>
            )}

            {params.error && (
                <div
                    role="alert"
                    className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700"
                >
                    {params.error}
                </div>
            )}

            {articles.length === 0 ? (
                <section className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm">
                    <h2 className="text-xl font-bold">
                        No hay artículos registrados
                    </h2>

                    <p className="mt-2 text-[var(--color-muted)]">
                        Crea el primer artículo desde el panel editorial.
                    </p>
                </section>
            ) : (
                <section className="mt-8 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] border-collapse text-left">
                            <thead className="bg-[var(--color-surface-soft)]">
                                <tr>
                                    <th className="px-5 py-4 text-sm font-bold">
                                        Artículo
                                    </th>

                                    <th className="px-5 py-4 text-sm font-bold">
                                        Categoría
                                    </th>

                                    <th className="px-5 py-4 text-sm font-bold">
                                        Publicación
                                    </th>

                                    <th className="px-5 py-4 text-sm font-bold">
                                        Fecha publicada
                                    </th>

                                    <th className="px-5 py-4 text-sm font-bold">
                                        Actualización
                                    </th>

                                    <th className="px-5 py-4 text-right text-sm font-bold">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {articles.map((article) => (
                                    <tr
                                        key={article.id}
                                        className="border-t border-[var(--color-border)]"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="font-bold">
                                                {article.title}
                                            </p>

                                            <p className="mt-1 text-sm text-[var(--color-muted)]">
                                                /{article.slug}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 text-sm">
                                            {article.category}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${editorialStatusStyles[
                                                    article.editorialStatus
                                                    ]
                                                    }`}
                                            >
                                                {
                                                    editorialStatusLabels[
                                                    article.editorialStatus
                                                    ]
                                                }
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-sm">
                                            {article.publishedAt ? (
                                                <time dateTime={article.publishedAt}>
                                                    {formatDate(article.publishedAt)}
                                                </time>
                                            ) : (
                                                <span className="text-[var(--color-muted)]">
                                                    Sin publicar
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-sm">
                                            <time dateTime={article.updatedAt}>
                                                {formatDate(article.updatedAt)}
                                            </time>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-3">
                                                {article.editorialStatus ===
                                                    "published" && (
                                                        <Link
                                                            href={`/blog/${article.slug}`}
                                                            className="text-sm font-bold text-[var(--color-muted)] hover:text-[var(--color-text)]"
                                                        >
                                                            Ver
                                                        </Link>
                                                    )}

                                                <Link
                                                    href={`/admin/articulos/${article.id}/editar`}
                                                    className="text-sm font-bold text-[var(--color-primary)]"
                                                >
                                                    Editar
                                                </Link>

                                                {article.editorialStatus !== "archived" && (
                                                    <ArchiveBlogPostButton
                                                        postId={article.id}
                                                        postTitle={article.title}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </main>
    );
}