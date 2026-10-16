import Link from "next/link";
import { notFound } from "next/navigation";

import { getAdminRankingEntriesData } from "@/features/rankings/services/admin-ranking.service";

type RankingPositionsPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    created?: string;
    updated?: string;
    removed?: string;
  }>;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function RankingPositionsPage({
  params,
  searchParams,
}: RankingPositionsPageProps) {
  const [{ id }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  const data = await getAdminRankingEntriesData(id);

  if (!data) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12">
      <Link
        href="/admin/rankings"
        className="text-sm font-bold text-[var(--color-primary)]"
      >
        ← Volver a clasificaciones
      </Link>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
  <header>
    <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
      Panel editorial
    </p>

    <h1 className="mt-2 text-3xl font-black">
      {data.ranking.name}
    </h1>

    <p className="mt-2 text-[var(--color-muted)]">
      {data.ranking.leagueName} —{" "}
      {data.ranking.seasonName}
    </p>

    <div className="mt-4 flex flex-wrap gap-3">
      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
        {data.entries.length} posiciones
      </span>

      <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-800">
        {data.participants.length} participantes
      </span>

      {data.ranking.isCurrent && (
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
          Clasificación vigente
        </span>
      )}
    </div>
  </header>

  <div className="flex flex-wrap gap-3">
  <Link
    href={`/admin/rankings/${id}/participantes`}
    className="inline-flex items-center justify-center rounded-full border border-[var(--color-primary)] px-6 py-3 font-bold text-[var(--color-primary)] transition hover:bg-sky-50"
  >
    Participantes
  </Link>

  <Link
    href={`/admin/rankings/${id}/posiciones/nueva`}
    className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 font-bold text-white transition hover:opacity-90"
  >
    Agregar posición
  </Link>
</div>
</div>

      {query.created === "1" && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800"
        >
          La posición se agregó correctamente.
        </div>
      )}

      {query.updated === "1" && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800"
        >
          La posición se actualizó correctamente.
        </div>
      )}

      {query.removed === "1" && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800"
        >
          La posición se eliminó correctamente.
        </div>
      )}

      {data.entries.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-8 shadow-sm">
          <h2 className="text-xl font-black">
            Sin posiciones registradas
          </h2>

          <p className="mt-2 text-[var(--color-muted)]">
            Esta clasificación todavía no tiene resultados.
          </p>

          {data.participants.length === 0 && (
            <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800">
              La temporada tampoco tiene participantes activos.
              Será necesario registrarlos antes de agregar
              posiciones.
            </p>
          )}
        </section>
      ) : (
        <div
          role="region"
          aria-label="Posiciones de la clasificación"
          tabIndex={0}
          className="mt-8 overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-white shadow-sm"
        >
          <table className="w-full min-w-[1200px] border-collapse text-left">
            <caption className="sr-only">
              Posiciones y estadísticas de la clasificación
            </caption>

            <thead className="bg-[var(--color-surface)]">
              <tr>
                <th scope="col" className="px-4 py-4">
                  Pos.
                </th>
                <th scope="col" className="px-4 py-4">
                  Freestyler
                </th>
                <th scope="col" className="px-4 py-4">
                  Grupo
                </th>
                <th scope="col" className="px-4 py-4">
                  PJ
                </th>
                <th scope="col" className="px-4 py-4">
                  VG
                </th>
                <th scope="col" className="px-4 py-4">
                  VR
                </th>
                <th scope="col" className="px-4 py-4">
                  DR
                </th>
                <th scope="col" className="px-4 py-4">
                  DG
                </th>
                <th scope="col" className="px-4 py-4">
                  Puntos
                </th>
                <th scope="col" className="px-4 py-4">
                  Score
                </th>
                <th scope="col" className="px-4 py-4">
                  Penalización
                </th>
              </tr>
            </thead>

            <tbody>
              {data.entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-t border-[var(--color-border)]"
                >
                  <th
                    scope="row"
                    className="px-4 py-4 text-lg font-black"
                  >
                    {entry.position}
                  </th>

                  <td className="px-4 py-4 font-bold">
                    {entry.stageName}
                  </td>

                  <td className="px-4 py-4">
                    {entry.rankingGroup}
                  </td>

                  <td className="px-4 py-4">
                    {entry.matchesPlayed}
                  </td>

                  <td className="px-4 py-4">
                    {entry.battleWins}
                  </td>

                  <td className="px-4 py-4">
                    {entry.battleWinsAfterReplica}
                  </td>

                  <td className="px-4 py-4">
                    {entry.battleLossesAfterReplica}
                  </td>

                  <td className="px-4 py-4">
                    {entry.battleLosses}
                  </td>

                  <td className="px-4 py-4 font-black">
                    {formatNumber(entry.points)}
                  </td>

                  <td className="px-4 py-4">
                    {formatNumber(entry.scoreTotal)}
                  </td>

                  <td className="px-4 py-4">
                    {formatNumber(entry.penaltyPoints)}
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