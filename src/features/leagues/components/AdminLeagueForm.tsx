"use client";

import Link from "next/link";

import {
  createLeague,
  updateLeague,
} from "../actions/admin-league.actions";
import type {
  AdminLeagueFormOptions,
  AdminLeagueFormValues,
} from "../types/league.types";

type AdminLeagueFormProps = {
  countries: AdminLeagueFormOptions["countries"];
  initialValues?: AdminLeagueFormValues;
};

const inputStyles =
  "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]";

export function AdminLeagueForm({
  countries,
  initialValues,
}: AdminLeagueFormProps) {
  const isEditing = Boolean(initialValues);

  const formAction = initialValues
    ? updateLeague.bind(null, initialValues.id)
    : createLeague;

  return (
    <form
      action={formAction}
      className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="font-bold">
            Nombre de la liga *
          </span>

          <input
            type="text"
            name="name"
            required
            defaultValue={initialValues?.name}
            className={inputStyles}
            placeholder="Ej. Liga Demo Nacional"
          />
        </label>

        <label className="block">
          <span className="font-bold">
            Nombre corto
          </span>

          <input
            type="text"
            name="shortName"
            defaultValue={initialValues?.shortName}
            className={inputStyles}
            placeholder="Ej. LDN"
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
            placeholder="liga-demo-nacional"
          />

          <span className="mt-2 block text-sm text-[var(--color-muted)]">
            Utiliza letras minúsculas, números y guiones.
          </span>
        </label>

        <label className="block md:col-span-2">
          <span className="font-bold">
            Descripción *
          </span>

          <textarea
            name="description"
            rows={6}
            required
            defaultValue={initialValues?.description}
            className={inputStyles}
            placeholder="Descripción pública de la liga."
          />
        </label>

        <label className="block">
          <span className="font-bold">
            País principal *
          </span>

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
              <option
                key={country.id}
                value={country.id}
              >
                {country.name}
              </option>
            ))}
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

        <label className="block md:col-span-2">
          <span className="font-bold">
            Ruta del logo
          </span>

          <input
            type="text"
            name="logoPath"
            defaultValue={initialValues?.logoPath}
            className={inputStyles}
            placeholder="leagues/logos/nombre-del-logo.webp"
          />

          <span className="mt-2 block text-sm text-[var(--color-muted)]">
            Ruta del archivo dentro del bucket public-media.
          </span>
        </label>

        <label className="block md:col-span-2">
          <span className="font-bold">
            Sitio web
          </span>

          <input
            type="url"
            name="websiteUrl"
            defaultValue={initialValues?.websiteUrl}
            className={inputStyles}
            placeholder="https://..."
          />
        </label>

        <label className="block">
          <span className="font-bold">
            Instagram
          </span>

          <input
            type="url"
            name="instagramUrl"
            defaultValue={initialValues?.instagramUrl}
            className={inputStyles}
            placeholder="https://instagram.com/..."
          />
        </label>

        <label className="block">
          <span className="font-bold">
            YouTube
          </span>

          <input
            type="url"
            name="youtubeUrl"
            defaultValue={initialValues?.youtubeUrl}
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
            : "Crear liga"}
        </button>

        <Link
          href="/admin/ligas"
          className="rounded-full border border-[var(--color-border)] px-6 py-3 font-bold transition hover:border-[var(--color-primary)]"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}