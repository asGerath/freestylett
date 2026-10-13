import Link from "next/link";

import { ArchiveLeagueButton } from "@/features/leagues/components/ArchiveLeagueButton";

import { getAdminLeagues } from "@/features/leagues/services/admin-league.service";
import type { LeagueEditorialStatus } from "@/features/leagues/types/league.types";

const editorialStatusLabels: Record<
    LeagueEditorialStatus,
    string
> = {
    draft: "Borrador",
    published: "Publicado",
    archived: "Archivado",
};

const editorialStatusStyles: Record<
    LeagueEditorialStatus,
    string
> = {
    draft: "bg-amber-100 text-amber-800",
    published: "bg-emerald-100 text-emerald-800",
    archived: "bg-slate-200 text-slate-700",
};

type AdminLeaguesPageProps = {
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

export default async function AdminLeaguesPage({
    searchParams,
}: AdminLeaguesPageProps) {
    const [leagues, params] = await Promise.all([
        getAdminLeagues(),
        searchParams,
    ]);

    const successMessage = params.created
        ? "La liga fue creada correctamente."
        : params.updated
            ? "La liga fue actualizada correctamente."
            : params.archived
                ? "La liga fue archivada correctamente."
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
                        Ligas
                    </h1>

                    <p className="mt-2 text-[var(--color-muted)]">
                        Consulta y administra las ligas registradas.
                    </p>
                </div>

                <Link
                    href="/admin/ligas/nueva"
                    className="inline-flex w-fit items-center justify-center rounded-full bg-[var(--color-primary)] px-5 py-3 font-bold text-white transition hover:opacity-90"
                >
                    Crear liga
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

            {leagues.length === 0 ? (
                <section className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm">
                    <h2 className="text-xl font-bold">
                        No hay ligas registradas
                    </h2>

                    <p className="mt-2 text-[var(--color-muted)]">
                        Crea la primera liga desde el panel editorial.
                    </p>
                </section>
            ) : (
                <section className="mt-8 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] border-collapse text-left">
                            <thead className="bg-[var(--color-surface-soft)]">
                                <tr>
                                    <th className="px-5 py-4 text-sm font-bold">
                                        Liga
                                    </th>

                                    <th className="px-5 py-4 text-sm font-bold">
                                        País principal
                                    </th>

                                    <th className="px-5 py-4 text-sm font-bold">
                                        Publicación
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
                                {leagues.map((league) => (
                                    <tr
                                        key={league.id}
                                        className="border-t border-[var(--color-border)]"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="font-bold">
                                                {league.name}
                                            </p>

                                            {league.shortName && (
                                                <p className="mt-1 text-sm font-medium">
                                                    {league.shortName}
                                                </p>
                                            )}

                                            <p className="mt-1 text-sm text-[var(--color-muted)]">
                                                /{league.slug}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 text-sm">
                                            {league.country}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${editorialStatusStyles[
                                                    league.editorialStatus
                                                    ]
                                                    }`}
                                            >
                                                {
                                                    editorialStatusLabels[
                                                    league.editorialStatus
                                                    ]
                                                }
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-sm">
                                            <time dateTime={league.updatedAt}>
                                                {formatDate(league.updatedAt)}
                                            </time>
                                        </td>

                                        <td className="px-5 py-4">

                                            <div className="flex items-center justify-end gap-3">
                                                {league.editorialStatus === "published" && (
                                                    <Link
                                                        href={`/ligas/${league.slug}`}
                                                        className="text-sm font-bold text-[var(--color-muted)] hover:text-[var(--color-text)]"
                                                    >
                                                        Ver
                                                    </Link>
                                                )}

                                                <Link
                                                    href={`/admin/ligas/${league.id}/editar`}
                                                    className="text-sm font-bold text-[var(--color-primary)]"
                                                >
                                                    Editar
                                                </Link>

                                                {league.editorialStatus !== "archived" && (
                                                    <ArchiveLeagueButton
                                                        leagueId={league.id}
                                                        leagueName={league.name}
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