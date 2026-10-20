"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type {
  AdminBattleFormOptions,
  AdminBattleFormValues,
} from "../types/battle.types";

type AdminBattleFormProps = {
  events: AdminBattleFormOptions["events"];
  seasons: AdminBattleFormOptions["seasons"];
  formAction: (formData: FormData) => void | Promise<void>;
  initialValues?: AdminBattleFormValues;
};

const inputStyles =
  "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]";

export function AdminBattleForm({
  events,
  seasons,
  formAction,
  initialValues,
}: AdminBattleFormProps) {
  const isEditing = Boolean(initialValues);

  const [eventId, setEventId] = useState(
    initialValues?.eventId ?? "",
  );

  const [seasonId, setSeasonId] = useState(
    initialValues?.seasonId ?? "",
  );

  const availableSeasons = useMemo(
    () =>
      seasons.filter((season) =>
        season.eventIds.includes(eventId),
      ),
    [eventId, seasons],
  );

  function handleEventChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const nextEventId = event.target.value;

    setEventId(nextEventId);

    const seasonStillAvailable = seasons.some(
      (season) =>
        season.id === seasonId &&
        season.eventIds.includes(nextEventId),
    );

    if (!seasonStillAvailable) {
      setSeasonId("");
    }
  }

  return (
    <form
      action={formAction}
      className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="font-bold">Evento *</span>

          <select
            name="eventId"
            required
            value={eventId}
            onChange={handleEventChange}
            className={inputStyles}
          >
            <option value="" disabled>
              Selecciona un evento
            </option>

            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="font-bold">Temporada</span>

          <select
            name="seasonId"
            value={seasonId}
            onChange={(event) =>
              setSeasonId(event.target.value)
            }
            disabled={!eventId}
            className={`${inputStyles} disabled:cursor-not-allowed disabled:bg-slate-100`}
          >
            <option value="">
              Sin temporada
            </option>

            {availableSeasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.leagueName} — {season.name}
              </option>
            ))}
          </select>

          <span className="mt-2 block text-sm text-[var(--color-muted)]">
            Solo aparecen temporadas relacionadas con el evento.
          </span>
        </label>

        <label className="block md:col-span-2">
          <span className="font-bold">Título *</span>

          <input
            type="text"
            name="title"
            required
            defaultValue={initialValues?.title}
            className={inputStyles}
            placeholder="Ej. MC Demo Norte vs MC Demo Sur"
          />
        </label>

        <label className="block">
          <span className="font-bold">Slug *</span>

          <input
            type="text"
            name="slug"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            defaultValue={initialValues?.slug}
            className={inputStyles}
            placeholder="mc-demo-norte-vs-mc-demo-sur"
          />

          <span className="mt-2 block text-sm text-[var(--color-muted)]">
            Utiliza letras minúsculas, números y guiones.
          </span>
        </label>

        <label className="block">
          <span className="font-bold">
            Orden dentro del evento *
          </span>

          <input
            type="number"
            name="battleOrder"
            required
            min={1}
            step={1}
            defaultValue={initialValues?.battleOrder ?? 1}
            className={inputStyles}
          />
        </label>

        <label className="block">
          <span className="font-bold">Fase *</span>

          <select
            name="stage"
            required
            defaultValue={
              initialValues?.stage ?? "regular_round"
            }
            className={inputStyles}
          >
            <option value="group_stage">Fase de grupos</option>
            <option value="play_in">Play-in</option>
            <option value="round_of_32">Dieciseisavos</option>
            <option value="round_of_16">Octavos</option>
            <option value="quarterfinal">Cuartos de final</option>
            <option value="semifinal">Semifinal</option>
            <option value="third_place">Tercer lugar</option>
            <option value="final">Final</option>
            <option value="regular_round">Jornada regular</option>
            <option value="exhibition">Exhibición</option>
            <option value="other">Otra</option>
          </select>
        </label>

        <label className="block">
          <span className="font-bold">Formato *</span>

          <select
            name="format"
            required
            defaultValue={
              initialValues?.format ?? "one_vs_one"
            }
            className={inputStyles}
          >
            <option value="one_vs_one">1 vs 1</option>
            <option value="two_vs_two">2 vs 2</option>
            <option value="three_vs_three">3 vs 3</option>
            <option value="crew">Crew</option>
            <option value="other">Otro</option>
          </select>
        </label>

        <label className="block">
          <span className="font-bold">
            Estado de la batalla *
          </span>

          <select
            name="status"
            required
            defaultValue={
              initialValues?.status ?? "scheduled"
            }
            className={inputStyles}
          >
            <option value="scheduled">Programada</option>
            <option value="live">En vivo</option>
            <option value="finished">Finalizada</option>
            <option value="cancelled">Cancelada</option>
            <option value="postponed">Pospuesta</option>
          </select>
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

        <label className="block">
          <span className="font-bold">Lado ganador</span>

          <input
            type="number"
            name="winnerSide"
            min={1}
            step={1}
            defaultValue={
              initialValues?.winnerSide ?? undefined
            }
            className={inputStyles}
            placeholder="Ej. 1"
          />
        </label>

        <label className="block">
          <span className="font-bold">
            Tipo de decisión
          </span>

          <select
            name="decisionType"
            defaultValue={
              initialValues?.decisionType ?? ""
            }
            className={inputStyles}
          >
            <option value="">Sin resultado</option>
            <option value="direct">Victoria directa</option>
            <option value="replica">Réplica</option>
            <option value="jury">Decisión del jurado</option>
            <option value="technical">Victoria técnica</option>
            <option value="walkover">Walkover</option>
            <option value="draw">Empate</option>
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
        </label>

        <label className="block md:col-span-2">
          <span className="font-bold">
            URL del video
          </span>

          <input
            type="url"
            name="videoUrl"
            defaultValue={initialValues?.videoUrl}
            className={inputStyles}
            placeholder="https://youtube.com/..."
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
            : "Crear batalla"}
        </button>

        <Link
          href="/admin/batallas"
          className="rounded-full border border-[var(--color-border)] px-6 py-3 font-bold transition hover:border-[var(--color-primary)]"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}