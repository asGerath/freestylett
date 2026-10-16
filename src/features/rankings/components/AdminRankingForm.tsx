"use client";

import Link from "next/link";

import {
  createRanking,
  updateRanking,
} from "../actions/admin-ranking.actions";
import type {
  AdminRankingFormOptions,
  AdminRankingFormValues,
} from "../types/ranking.types";

type AdminRankingFormProps = {
  seasons: AdminRankingFormOptions["seasons"];
  initialValues?: AdminRankingFormValues;
};

const inputStyles =
  "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]";

function formatDateTimeLocal(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

export function AdminRankingForm({
  seasons,
  initialValues,
}: AdminRankingFormProps) {
  const isEditing = Boolean(initialValues);

  const formAction = initialValues
    ? updateRanking.bind(null, initialValues.id)
    : createRanking;

  return (
    <form
      action={formAction}
      className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="font-bold">Temporada *</span>

          <select
            name="seasonId"
            required
            defaultValue={initialValues?.seasonId ?? ""}
            className={inputStyles}
          >
            <option value="" disabled>
              Selecciona una temporada
            </option>

            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.leagueName} — {season.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block md:col-span-2">
          <span className="font-bold">
            Nombre de la clasificación *
          </span>

          <input
            type="text"
            name="name"
            required
            defaultValue={initialValues?.name}
            className={inputStyles}
            placeholder="Ej. Clasificación general - Jornada 5"
          />
        </label>

        <label className="block">
          <span className="font-bold">
            Fecha de captura *
          </span>

          <input
            type="datetime-local"
            name="capturedAt"
            required
            defaultValue={formatDateTimeLocal(
              initialValues?.capturedAt,
            )}
            className={inputStyles}
          />
        </label>

        <label className="block">
          <span className="font-bold">
            Estado editorial *
          </span>

          <select
            name="editorialStatus"
            required
            defaultValue={
              initialValues?.editorialStatus ?? "draft"
            }
            className={inputStyles}
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="archived">Archivado</option>
          </select>
        </label>

        <label className="block md:col-span-2">
          <span className="font-bold">
            URL de la fuente *
          </span>

          <input
            type="url"
            name="sourceUrl"
            required
            defaultValue={initialValues?.sourceUrl}
            className={inputStyles}
            placeholder="https://..."
          />

          <span className="mt-2 block text-sm text-[var(--color-muted)]">
            Enlace oficial desde donde se obtuvo la
            clasificación.
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-[var(--color-border)] p-4 md:col-span-2">
          <input
            type="checkbox"
            name="isCurrent"
            defaultChecked={initialValues?.isCurrent}
            className="mt-1 size-5 cursor-pointer accent-[var(--color-primary)]"
          />

          <span>
            <strong className="block">
              Marcar como clasificación vigente
            </strong>

            <span className="mt-1 block text-sm text-[var(--color-muted)]">
              Reemplazará la clasificación vigente de esta
              temporada. Para activarla, el estado debe ser
              “Publicado”.
            </span>
          </span>
        </label>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="submit"
          className="cursor-pointer rounded-full bg-[var(--color-primary)] px-6 py-3 font-bold text-white transition hover:opacity-90"
        >
          {isEditing
            ? "Guardar cambios"
            : "Crear clasificación"}
        </button>

        <Link
          href="/admin/rankings"
          className="rounded-full border border-[var(--color-border)] px-6 py-3 font-bold transition hover:border-[var(--color-primary)]"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}