import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminRankingEntryForm } from "@/features/rankings/components/AdminRankingEntryForm";
import { getAdminRankingEntriesData } from "@/features/rankings/services/admin-ranking.service";

type NewRankingEntryPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewRankingEntryPage({
  params,
  searchParams,
}: NewRankingEntryPageProps) {
  const [{ id }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  const data = await getAdminRankingEntriesData(id);

  if (!data) {
    notFound();
  }

  const registeredParticipantIds = new Set(
    data.entries.map((entry) => entry.participantId),
  );

  const availableParticipants =
    data.participants.filter(
      (participant) =>
        !registeredParticipantIds.has(participant.id),
    );

  const defaultPosition =
    data.entries.length === 0
      ? 1
      : Math.max(
          ...data.entries.map((entry) => entry.position),
        ) + 1;

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
          Agregar posición
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          {data.ranking.name} —{" "}
          {data.ranking.leagueName}
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

      {availableParticipants.length === 0 ? (
        <div
          role="alert"
          className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800"
        >
          No existen participantes disponibles. Todos los
          participantes activos ya tienen una posición o la
          temporada todavía no tiene participantes.
        </div>
      ) : (
        <AdminRankingEntryForm
          rankingId={id}
          participants={availableParticipants}
          defaultPosition={defaultPosition}
        />
      )}
    </main>
  );
}