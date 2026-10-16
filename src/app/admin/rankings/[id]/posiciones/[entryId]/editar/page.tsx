import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminRankingEntryForm } from "@/features/rankings/components/AdminRankingEntryForm";
import { getAdminRankingEntriesData } from "@/features/rankings/services/admin-ranking.service";

type EditRankingEntryPageProps = {
  params: Promise<{
    id: string;
    entryId: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditRankingEntryPage({
  params,
  searchParams,
}: EditRankingEntryPageProps) {
  const [{ id, entryId }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  const data =
    await getAdminRankingEntriesData(id);

  if (!data) {
    notFound();
  }

  const entry = data.entries.find(
    (currentEntry) =>
      currentEntry.id === entryId,
  );

  if (!entry) {
    notFound();
  }

  const initialValues = {
    id: entry.id,
    participantId: entry.participantId,
    rankingGroup: entry.rankingGroup,
    position: entry.position,
    matchesPlayed: entry.matchesPlayed,
    battleWins: entry.battleWins,
    battleWinsAfterReplica:
      entry.battleWinsAfterReplica,
    battleLossesAfterReplica:
      entry.battleLossesAfterReplica,
    battleLosses: entry.battleLosses,
    points: entry.points,
    scoreTotal: entry.scoreTotal,
    penaltyPoints: entry.penaltyPoints,
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <Link
        href={`/admin/rankings/${id}/posiciones`}
        className="text-sm font-bold text-[var(--color-primary)]"
      >
        ← Volver a posiciones
      </Link>

      <header className="mt-6">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Panel editorial
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Editar posición
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          {entry.stageName} —{" "}
          {data.ranking.name}
        </p>

        <p className="mt-1 text-sm text-[var(--color-muted)]">
          {data.ranking.leagueName} —{" "}
          {data.ranking.seasonName}
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

      <AdminRankingEntryForm
        rankingId={id}
        participants={data.participants}
        initialValues={initialValues}
      />
    </main>
  );
}