import Link from "next/link";

import type { RankingSnapshotItem } from "../types/ranking.types";

type RankingTableProps = {
  ranking: RankingSnapshotItem;
};

function formatCapturedAt(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatMetric(value: number) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function RankingTable({ ranking }: RankingTableProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm">
      <header className="border-b border-[var(--color-border)] p-6">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Clasificación actual
        </p>

        <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black">
              <Link
                href={`/ligas/${ranking.league.slug}`}
                className="transition hover:text-[var(--color-primary)]"
              >
                {ranking.league.name}
              </Link>
            </h2>

            <p className="mt-1 text-[var(--color-muted)]">
              {ranking.season.name} · {ranking.name}
            </p>
          </div>

          <p className="text-sm text-[var(--color-muted)]">
            Actualizado el{" "}
            <time dateTime={ranking.capturedAt}>
              {formatCapturedAt(ranking.capturedAt)}
            </time>
          </p>
        </div>
      </header>

      {ranking.entries.length > 0 ? (
        <div
          className="overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label={`Clasificación de ${ranking.league.name}`}
        >
          <table className="w-full min-w-[900px] border-collapse text-left">
            <caption className="sr-only">
              Clasificación actual de {ranking.league.name},{" "}
              {ranking.season.name}
            </caption>

            <thead className="bg-[var(--color-surface)] text-xs uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-5 py-4">
                  Pos.
                </th>

                <th scope="col" className="px-5 py-4">
                  Freestyler
                </th>

                <th scope="col" className="px-3 py-4 text-center">
                  MC
                </th>

                <th scope="col" className="px-3 py-4 text-center">
                  BG
                </th>

                <th scope="col" className="px-3 py-4 text-center">
                  BGR
                </th>

                <th scope="col" className="px-3 py-4 text-center">
                  BPR
                </th>

                <th scope="col" className="px-3 py-4 text-center">
                  BP
                </th>

                <th scope="col" className="px-3 py-4 text-center">
                  PTS
                </th>

                <th scope="col" className="px-3 py-4 text-center">
                  PTB
                </th>
              </tr>
            </thead>

            <tbody>
              {ranking.entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-t border-[var(--color-border)]"
                >
                  <td className="px-5 py-4 text-lg font-black">
                    {entry.position}
                  </td>

                  <td className="px-5 py-4">
                    <Link
                      href={`/freestylers/${entry.freestyler.slug}`}
                      className="font-bold transition hover:text-[var(--color-primary)]"
                    >
                      {entry.freestyler.stageName}
                    </Link>

                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {entry.freestyler.country}
                    </p>
                  </td>

                  <td className="px-3 py-4 text-center">
                    {entry.matchesPlayed}
                  </td>

                  <td className="px-3 py-4 text-center">
                    {entry.battleWins}
                  </td>

                  <td className="px-3 py-4 text-center">
                    {entry.battleWinsAfterReplica}
                  </td>

                  <td className="px-3 py-4 text-center">
                    {entry.battleLossesAfterReplica}
                  </td>

                  <td className="px-3 py-4 text-center">
                    {entry.battleLosses}
                  </td>

                  <td className="px-3 py-4 text-center font-bold">
                    {formatMetric(entry.points)}
                  </td>

                  <td className="px-3 py-4 text-center font-bold">
                    {formatMetric(entry.scoreTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="p-6 text-[var(--color-muted)]">
          Esta clasificación todavía no tiene posiciones publicadas.
        </p>
      )}

      <footer className="border-t border-[var(--color-border)] px-6 py-4">
        <a
          href={ranking.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-bold text-[var(--color-primary)] hover:underline"
        >
          Consultar fuente oficial
        </a>
      </footer>
    </section>
  );
}