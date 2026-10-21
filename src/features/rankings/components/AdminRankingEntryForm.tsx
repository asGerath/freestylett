"use client";

import Link from "next/link";

import {
  createRankingEntry,
  updateRankingEntry,
} from "../actions/admin-ranking.actions";

import type {
  AdminRankingEntryFormValues,
  AdminRankingParticipantOption,
} from "../types/ranking.types";

type AdminRankingEntryFormProps = {
  rankingId: string;
  participants: AdminRankingParticipantOption[];
  defaultPosition?: number;
  initialValues?: AdminRankingEntryFormValues;
};

const inputStyles =
  "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]";

export function AdminRankingEntryForm({
  rankingId,
  participants,
  defaultPosition = 1,
  initialValues,
}: AdminRankingEntryFormProps) {
  const isEditing = Boolean(initialValues);

  const formAction = initialValues
    ? updateRankingEntry.bind(
        null,
        rankingId,
        initialValues.id,
      )
    : createRankingEntry.bind(null, rankingId);

  return (
    <form
      action={formAction}
      className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="font-bold">
            Participante *
          </span>

          <select
            name="participantId"
            required
            defaultValue={
              initialValues?.participantId ?? ""
            }
            className={inputStyles}
          >
            <option value="" disabled>
              Selecciona un participante
            </option>

            {participants.map((participant) => (
              <option
                key={participant.id}
                value={participant.id}
              >
                {participant.stageName}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="font-bold">
            Posición *
          </span>

          <input
            type="number"
            name="position"
            required
            min="1"
            step="1"
            defaultValue={
              initialValues?.position ??
              defaultPosition
            }
            className={inputStyles}
          />
        </label>

        <label className="block">
          <span className="font-bold">
            Grupo *
          </span>

          <input
            type="text"
            name="rankingGroup"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            defaultValue={
              initialValues?.rankingGroup ??
              "general"
            }
            className={inputStyles}
          />

          <span className="mt-2 block text-sm text-[var(--color-muted)]">
            Usa letras minúsculas, números y guiones.
          </span>
        </label>

        <label className="block">
          <span className="font-bold">
            Jornadas disputadas
          </span>

          <input
            type="number"
            name="matchesPlayed"
            required
            min="0"
            step="1"
            defaultValue={
              initialValues?.matchesPlayed ?? 0
            }
            className={inputStyles}
          />
        </label>

        <label className="block">
          <span className="font-bold">
            Victorias directas
          </span>

          <input
            type="number"
            name="battleWins"
            required
            min="0"
            step="1"
            defaultValue={
              initialValues?.battleWins ?? 0
            }
            className={inputStyles}
          />
        </label>

        <label className="block">
          <span className="font-bold">
            Victorias tras réplica
          </span>

          <input
            type="number"
            name="battleWinsAfterReplica"
            required
            min="0"
            step="1"
            defaultValue={
              initialValues
                ?.battleWinsAfterReplica ?? 0
            }
            className={inputStyles}
          />
        </label>

        <label className="block">
          <span className="font-bold">
            Derrotas tras réplica
          </span>

          <input
            type="number"
            name="battleLossesAfterReplica"
            required
            min="0"
            step="1"
            defaultValue={
              initialValues
                ?.battleLossesAfterReplica ?? 0
            }
            className={inputStyles}
          />
        </label>

        <label className="block">
          <span className="font-bold">
            Derrotas directas
          </span>

          <input
            type="number"
            name="battleLosses"
            required
            min="0"
            step="1"
            defaultValue={
              initialValues?.battleLosses ?? 0
            }
            className={inputStyles}
          />
        </label>

        <label className="block">
          <span className="font-bold">
            Puntos
          </span>

          <input
            type="number"
            name="points"
            required
            min="0"
            step="0.01"
            defaultValue={
              initialValues?.points ?? 0
            }
            className={inputStyles}
          />
        </label>

        <label className="block">
          <span className="font-bold">
            Puntaje total
          </span>

          <input
            type="number"
            name="scoreTotal"
            required
            min="0"
            step="0.01"
            defaultValue={
              initialValues?.scoreTotal ?? 0
            }
            className={inputStyles}
          />
        </label>

        <label className="block">
          <span className="font-bold">
            MVP
          </span>

          <input
            type="number"
            name="mvpCount"
            required
            min="0"
            step="1"
            defaultValue={
              initialValues?.mvpCount ?? 0
            }
            className={inputStyles}
          />
        </label>

        <label className="block">
          <span className="font-bold">
            Puntos de penalización
          </span>

          <input
            type="number"
            name="penaltyPoints"
            required
            min="0"
            step="0.01"
            defaultValue={
              initialValues?.penaltyPoints ?? 0
            }
            className={inputStyles}
          />
        </label>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="submit"
          className="cursor-pointer rounded-full bg-[var(--color-primary)] px-6 py-3 font-bold text-white transition hover:opacity-90"
        >
          {isEditing
            ? "Guardar cambios"
            : "Agregar posición"}
        </button>

        <Link
          href={`/admin/rankings/${rankingId}/posiciones`}
          className="rounded-full border border-[var(--color-border)] px-6 py-3 font-bold transition hover:border-[var(--color-primary)]"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}