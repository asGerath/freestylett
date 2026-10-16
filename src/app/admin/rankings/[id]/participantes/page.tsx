import Link from "next/link";
import { notFound } from "next/navigation";

import {
  addSeasonParticipant,
  setSeasonParticipantActive,
} from "@/features/rankings/actions/admin-ranking.actions";
import { getAdminRankingParticipantsData } from "@/features/rankings/services/admin-ranking.service";

type RankingParticipantsPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    added?: string;
    updated?: string;
    error?: string;
  }>;
};

const inputStyles =
  "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]";

export default async function RankingParticipantsPage({
  params,
  searchParams,
}: RankingParticipantsPageProps) {
  const [{ id }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  const data =
    await getAdminRankingParticipantsData(id);

  if (!data) {
    notFound();
  }

  const addParticipantAction =
    addSeasonParticipant.bind(null, id);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
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
          Participantes
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          {data.ranking.name} —{" "}
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

      {query.added === "1" && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800"
        >
          El freestyler se inscribió correctamente.
        </div>
      )}

      {query.updated === "1" && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800"
        >
          El estado del participante se actualizó
          correctamente.
        </div>
      )}

      <section className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black">
          Inscribir freestyler
        </h2>

        <p className="mt-2 text-[var(--color-muted)]">
          Agrega un perfil existente a esta temporada.
        </p>

        {data.availableFreestylers.length === 0 ? (
          <div
            role="status"
            className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800"
          >
            Todos los freestylers disponibles ya están
            inscritos en esta temporada.
          </div>
        ) : (
          <form
            action={addParticipantAction}
            className="mt-6 grid gap-5 md:grid-cols-[1fr_180px_auto] md:items-end"
          >
            <label className="block">
              <span className="font-bold">
                Freestyler *
              </span>

              <select
                name="freestylerId"
                required
                defaultValue=""
                className={inputStyles}
              >
                <option value="" disabled>
                  Selecciona un freestyler
                </option>

                {data.availableFreestylers.map(
                  (freestyler) => (
                    <option
                      key={freestyler.id}
                      value={freestyler.id}
                    >
                      {freestyler.stageName} —{" "}
                      {freestyler.country}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label className="block">
              <span className="font-bold">
                Seed inicial
              </span>

              <input
                type="number"
                name="seed"
                min="1"
                step="1"
                className={inputStyles}
                placeholder="Opcional"
              />
            </label>

            <button
              type="submit"
              className="cursor-pointer rounded-full bg-[var(--color-primary)] px-6 py-3 font-bold text-white transition hover:opacity-90"
            >
              Inscribir
            </button>
          </form>
        )}
      </section>

      {data.participants.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-8 shadow-sm">
          <p className="text-[var(--color-muted)]">
            La temporada todavía no tiene participantes.
          </p>
        </section>
      ) : (
        <div
          role="region"
          aria-label="Participantes de la temporada"
          tabIndex={0}
          className="mt-8 overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-white shadow-sm"
        >
          <table className="w-full min-w-[800px] border-collapse text-left">
            <caption className="sr-only">
              Participantes inscritos en la temporada
            </caption>

            <thead className="bg-[var(--color-surface)]">
              <tr>
                <th scope="col" className="px-5 py-4">
                  Freestyler
                </th>
                <th scope="col" className="px-5 py-4">
                  Seed
                </th>
                <th scope="col" className="px-5 py-4">
                  Estado
                </th>
                <th scope="col" className="px-5 py-4">
                  Posición
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
              {data.participants.map((participant) => {
                const statusAction =
                  setSeasonParticipantActive.bind(
                    null,
                    id,
                    participant.id,
                    !participant.isActive,
                  );

                const cannotDeactivate =
                  participant.isActive &&
                  participant.hasRankingEntry;

                return (
                  <tr
                    key={participant.id}
                    className="border-t border-[var(--color-border)]"
                  >
                    <th
                      scope="row"
                      className="px-5 py-4"
                    >
                      <span className="block font-bold">
                        {participant.stageName}
                      </span>

                      <span className="mt-1 block text-sm text-[var(--color-muted)]">
                        /{participant.slug}
                      </span>
                    </th>

                    <td className="px-5 py-4">
                      {participant.seed ?? "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={
                          participant.isActive
                            ? "inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800"
                            : "inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700"
                        }
                      >
                        {participant.isActive
                          ? "Activo"
                          : "Inactivo"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {participant.hasRankingEntry
                        ? "Registrada"
                        : "Pendiente"}
                    </td>

                    <td className="px-5 py-4 text-right">
                      {cannotDeactivate ? (
                        <span className="text-sm text-[var(--color-muted)]">
                          Elimina primero su posición
                        </span>
                      ) : (
                        <form action={statusAction}>
                          <button
                            type="submit"
                            className={
                              participant.isActive
                                ? "cursor-pointer rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
                                : "cursor-pointer rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
                            }
                          >
                            {participant.isActive
                              ? "Desactivar"
                              : "Activar"}
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}