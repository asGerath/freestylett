import Link from "next/link";
import { notFound } from "next/navigation";

import {
  addBattleParticipant,
  updateBattleParticipant,
} from "@/features/battles/actions/admin-battle-participant.actions";
import { AdminBattleParticipantForm } from "@/features/battles/components/AdminBattleParticipantForm";
import { RemoveBattleParticipantButton } from "@/features/battles/components/RemoveBattleParticipantButton";
import { getAdminBattleParticipantsData } from "@/features/battles/services/admin-battle.service";

type BattleParticipantsPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    added?: string;
    updated?: string;
    removed?: string;
    error?: string;
  }>;
};

const battleFormatLabels = {
  one_vs_one: "1 vs 1",
  two_vs_two: "2 vs 2",
  three_vs_three: "3 vs 3",
  crew: "Crew",
  other: "Otro",
};

export default async function BattleParticipantsPage({
  params,
  searchParams,
}: BattleParticipantsPageProps) {
  const [{ id }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  const data =
    await getAdminBattleParticipantsData(id);

  if (!data) {
    notFound();
  }

  const addParticipantAction =
    addBattleParticipant.bind(null, id);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <Link
        href="/admin/batallas"
        className="text-sm font-bold text-[var(--color-primary)]"
      >
        ← Volver a batallas
      </Link>

      <header className="mt-6">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Panel editorial
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Participantes de la batalla
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          {data.battle.title} —{" "}
          {data.battle.eventTitle}
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">
            {data.participants.length}{" "}
            {data.participants.length === 1
              ? "participante"
              : "participantes"}
          </span>

          <span className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">
            Formato:{" "}
            {
              battleFormatLabels[
                data.battle.format
              ]
            }
          </span>
        </div>
      </header>

      {query.added && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800"
        >
          El participante fue agregado correctamente.
        </div>
      )}

      {query.updated && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800"
        >
          El participante fue actualizado correctamente.
        </div>
      )}

      {query.removed && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800"
        >
          El participante fue retirado correctamente.
        </div>
      )}

      {query.error && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700"
        >
          {query.error}
        </div>
      )}

      <section className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black">
          Agregar participante
        </h2>

        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Solo aparecen competidores registrados en el
          evento y, cuando corresponde, activos en la
          temporada seleccionada.
        </p>

        {data.availableParticipants.length === 0 ? (
          <div
            role="status"
            className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800"
          >
            No existen más competidores disponibles para
            agregar a esta batalla.
          </div>
        ) : (
          <div className="mt-6">
            <AdminBattleParticipantForm
              participants={
                data.availableParticipants
              }
              format={data.battle.format}
              formAction={addParticipantAction}
            />
          </div>
        )}
      </section>

      <section className="mt-8">
        <div>
          <h2 className="text-2xl font-black">
            Participantes registrados
          </h2>

          <p className="mt-2 text-[var(--color-muted)]">
            Puedes modificar el lado, la posición y la
            puntuación de cada participante.
          </p>
        </div>

        {data.participants.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm">
            <h3 className="text-xl font-bold">
              La batalla todavía no tiene participantes
            </h3>

            <p className="mt-2 text-[var(--color-muted)]">
              Utiliza el formulario superior para agregar
              al primer competidor.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {data.participants.map((participant) => {
              const updateParticipantAction =
                updateBattleParticipant.bind(
                  null,
                  id,
                  participant.id,
                );

              const participantOptions = [
                {
                  freestylerId:
                    participant.freestylerId,
                  stageName:
                    participant.stageName,
                  slug: participant.slug,
                  country: "",
                },
                ...data.availableParticipants,
              ];

              return (
                <article
                  key={participant.id}
                  className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
                >
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black">
                        {participant.stageName}
                      </h3>

                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        Lado{" "}
                        {participant.sideNumber} ·
                        Posición{" "}
                        {participant.slotNumber}
                      </p>

                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        Puntuación:{" "}
                        {participant.score ?? "Sin registrar"}
                      </p>
                    </div>

                    <RemoveBattleParticipantButton
                      battleId={id}
                      participantId={participant.id}
                      participantName={
                        participant.stageName
                      }
                    />
                  </div>

                  <AdminBattleParticipantForm
                    participants={
                      participantOptions
                    }
                    format={data.battle.format}
                    initialValues={participant}
                    formAction={
                      updateParticipantAction
                    }
                    submitLabel="Guardar cambios"
                  />
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}