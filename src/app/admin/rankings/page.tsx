import Link from "next/link";
import { ArchiveRankingButton } from "@/features/rankings/components/ArchiveRankingButton";

import { getAdminRankings } from "@/features/rankings/services/admin-ranking.service";
import type { RankingEditorialStatus } from "@/features/rankings/types/ranking.types";

type AdminRankingsPageProps = {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    archived?: string;
  }>;
};

const statusLabels: Record<
  RankingEditorialStatus,
  string
> = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
};

const statusStyles: Record<
  RankingEditorialStatus,
  string
> = {
  draft: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
  archived: "bg-slate-200 text-slate-700",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date(value));
}

export default async function AdminRankingsPage({
  searchParams,
}: AdminRankingsPageProps) {
  const [rankings, params] = await Promise.all([
    getAdminRankings(),
    searchParams,
  ]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12">
      <Link
        href="/admin"
        className="text-sm font-bold text-[var(--color-primary)]"
      >
        ← Volver al panel
      </Link>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <header>
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
            Panel editorial
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Clasificaciones
          </h1>

          <p className="mt-2 text-[var(--color-muted)]">
            Consulta y administra las clasificaciones
            registradas.
          </p>
        </header>

        <Link
          href="/admin/rankings/nuevo"
          className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 font-bold text-white transition hover:opacity-90"
        >
          Crear clasificación
        </Link>
      </div>

      {params.created === "1" && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800"
        >
          La clasificación se creó correctamente.
        </div>
      )}

      {params.updated === "1" && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800"
        >
          La clasificación se actualizó correctamente.
        </div>
      )}

      {params.archived === "1" && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800"
        >
          La clasificación se archivó correctamente.
        </div>
      )}

      {rankings.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-8 shadow-sm">
          <p className="text-[var(--color-muted)]">
            Todavía no existen clasificaciones registradas.
          </p>
        </section>
      ) : (
        <div
          role="region"
          aria-label="Clasificaciones registradas"
          tabIndex={0}
          className="mt-8 overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-white shadow-sm"
        >
          <table className="w-full min-w-[1100px] border-collapse text-left">
            <caption className="sr-only">
              Listado administrativo de clasificaciones
            </caption>

            <thead className="bg-[var(--color-surface)]">
              <tr>
                <th scope="col" className="px-5 py-4">
                  Clasificación
                </th>

                <th scope="col" className="px-5 py-4">
                  Liga y temporada
                </th>

                <th scope="col" className="px-5 py-4">
                  Capturada
                </th>

                <th scope="col" className="px-5 py-4">
                  Posiciones
                </th>

                <th scope="col" className="px-5 py-4">
                  Publicación
                </th>

                <th scope="col" className="px-5 py-4">
                  Actualizada
                </th>

                <th
                  scope="col"
                  className="px-5 py-4 text-right"
                >
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {rankings.map((ranking) => (
                <tr
                  key={ranking.id}
                  className="border-t border-[var(--color-border)]"
                >
                  <th
                    scope="row"
                    className="px-5 py-4 font-bold"
                  >
                    <span className="block">
                      {ranking.name}
                    </span>

                    {ranking.isCurrent && (
                      <span className="mt-2 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                        Vigente
                      </span>
                    )}
                  </th>

                  <td className="px-5 py-4">
                    <span className="block font-semibold">
                      {ranking.leagueName}
                    </span>

                    <span className="mt-1 block text-sm text-[var(--color-muted)]">
                      {ranking.seasonName}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {formatDate(ranking.capturedAt)}
                  </td>

                  <td className="px-5 py-4">
                    {ranking.entriesCount}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusStyles[ranking.editorialStatus]}`}
                    >
                      {statusLabels[ranking.editorialStatus]}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {formatDate(ranking.updatedAt)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-4">
                      {ranking.editorialStatus === "published" && (
                        <Link
                          href={`/ligas/${ranking.leagueSlug}`}
                          className="font-bold text-[var(--color-muted)] transition hover:text-[var(--color-primary)]"
                        >
                          Ver
                        </Link>
                      )}

                      <Link
                        href={`/admin/rankings/${ranking.id}/editar`}
                        className="font-bold text-[var(--color-primary)]"
                      >
                        Editar
                      </Link>

                      <Link
                        href={`/admin/rankings/${ranking.id}/posiciones`}
                        className="font-bold text-[var(--color-muted)] transition hover:text-[var(--color-primary)]"
                      >
                        Posiciones
                      </Link>

                      {ranking.editorialStatus !== "archived" && (
                        <ArchiveRankingButton
                          rankingId={ranking.id}
                          rankingName={ranking.name}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}