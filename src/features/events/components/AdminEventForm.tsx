"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  createEvent,
  updateEvent,
} from "../actions/admin-event.actions";
import type {
  AdminEventFormOptions,
  AdminEventFormValues,
} from "../types/event.types";

type AdminEventFormProps = {
  countries: AdminEventFormOptions["countries"];
  initialValues?: AdminEventFormValues;
};

const inputStyles =
  "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]";

function formatDateTimeLocal(value: string, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value));

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

function getTimeZoneOffset(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  const timeZoneDate = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );

  return timeZoneDate - date.getTime();
}

function convertLocalDateToIso(value: string, timeZone: string) {
  if (!value) {
    return "";
  }

  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const localTimeAsUtc = Date.UTC(
    year,
    month - 1,
    day,
    hour,
    minute,
  );

  let utcTime = localTimeAsUtc;

  for (let iteration = 0; iteration < 2; iteration += 1) {
    const offset = getTimeZoneOffset(
      new Date(utcTime),
      timeZone,
    );

    utcTime = localTimeAsUtc - offset;
  }

  return new Date(utcTime).toISOString();
}

export function AdminEventForm({
  countries,
  initialValues,
}: AdminEventFormProps) {
  const isEditing = Boolean(initialValues);

  const [timeZone, setTimeZone] = useState(
    initialValues?.timeZone ?? "America/Mexico_City",
  );

  const [startsAtLocal, setStartsAtLocal] = useState(() =>
    initialValues
      ? formatDateTimeLocal(
          initialValues.startsAt,
          initialValues.timeZone,
        )
      : "",
  );


  const startsAt = useMemo(() => {
    try {
      return convertLocalDateToIso(startsAtLocal, timeZone);
    } catch {
      return "";
    }
  }, [startsAtLocal, timeZone]);

  const formAction = initialValues
    ? updateEvent.bind(null, initialValues.id)
    : createEvent;

  return (
    <form
      action={formAction}
      className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8"
    >
      <input type="hidden" name="startsAt" value={startsAt} />

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="font-bold">Título *</span>
          <input
            type="text"
            name="title"
            required
            defaultValue={initialValues?.title}
            className={inputStyles}
            placeholder="Ej. Final Nacional México 2027"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="font-bold">Slug *</span>
          <input
            type="text"
            name="slug"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            defaultValue={initialValues?.slug}
            className={inputStyles}
            placeholder="final-nacional-mexico-2027"
          />
          <span className="mt-2 block text-sm text-[var(--color-muted)]">
            Utiliza letras minúsculas, números y guiones.
          </span>
        </label>

        <label className="block md:col-span-2">
          <span className="font-bold">Descripción</span>
          <textarea
            name="description"
            rows={5}
            defaultValue={initialValues?.description}
            className={inputStyles}
            placeholder="Descripción pública del evento."
          />
        </label>

        <label className="block">
          <span className="font-bold">País *</span>
          <select
            name="countryId"
            required
            defaultValue={initialValues?.countryId ?? ""}
            className={inputStyles}
          >
            <option value="" disabled>
              Selecciona un país
            </option>

            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="font-bold">Ciudad *</span>
          <input
            type="text"
            name="city"
            required
            defaultValue={initialValues?.city}
            className={inputStyles}
            placeholder="Ciudad de México"
          />
        </label>

        <label className="block">
          <span className="font-bold">Lugar</span>
          <input
            type="text"
            name="venueName"
            defaultValue={initialValues?.venueName}
            className={inputStyles}
            placeholder="Foro, teatro o plaza"
          />
        </label>

        <label className="block">
          <span className="font-bold">Fecha y hora local *</span>
          <input
            type="datetime-local"
            required
            value={startsAtLocal}
            onChange={(event) =>
              setStartsAtLocal(event.target.value)
            }
            className={inputStyles}
          />
        </label>

        <label className="block md:col-span-2">
          <span className="font-bold">
            Zona horaria del evento *
          </span>
          <input
            type="text"
            name="timeZone"
            required
            value={timeZone}
            onChange={(event) => setTimeZone(event.target.value)}
            className={inputStyles}
            placeholder="America/Mexico_City"
          />
          <span className="mt-2 block text-sm text-[var(--color-muted)]">
            Utiliza una zona IANA, por ejemplo:
            America/Mexico_City, America/Argentina/Buenos_Aires o
            Europe/Madrid.
          </span>
        </label>

        <label className="block">
          <span className="font-bold">Tipo de evento *</span>
          <select
            name="eventType"
            required
            defaultValue={initialValues?.eventType ?? "other"}
            className={inputStyles}
          >
            <option value="league_round">Jornada de liga</option>
            <option value="qualifier">Clasificatoria</option>
            <option value="regional">Regional</option>
            <option value="national_final">Final nacional</option>
            <option value="international_final">
              Final internacional
            </option>
            <option value="tournament">Torneo</option>
            <option value="exhibition">Exhibición</option>
            <option value="other">Otro</option>
          </select>
        </label>

        <label className="block">
          <span className="font-bold">Estado del evento *</span>
          <select
            name="eventStatus"
            required
            defaultValue={
              initialValues?.eventStatus ?? "scheduled"
            }
            className={inputStyles}
          >
            <option value="scheduled">Programado</option>
            <option value="live">En vivo</option>
            <option value="finished">Finalizado</option>
            <option value="cancelled">Cancelado</option>
            <option value="postponed">Pospuesto</option>
          </select>
        </label>

        <label className="block">
          <span className="font-bold">Estado editorial *</span>
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
          <span className="font-bold">URL oficial</span>
          <input
            type="url"
            name="officialUrl"
            defaultValue={initialValues?.officialUrl}
            className={inputStyles}
            placeholder="https://..."
          />
        </label>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="submit"
          className="rounded-full bg-[var(--color-primary)] px-6 py-3 font-bold text-white transition hover:opacity-90"
        >
          {isEditing ? "Guardar cambios" : "Crear evento"}
        </button>

        <Link
          href="/admin/eventos"
          className="rounded-full border border-[var(--color-border)] px-6 py-3 font-bold transition hover:border-[var(--color-primary)]"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}