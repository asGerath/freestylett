"use client";

import Link from "next/link";

import {
  createFreestyler,
  updateFreestyler,
} from "../actions/admin-freestyler.actions";
import type {
  AdminFreestylerFormOptions,
  AdminFreestylerFormValues,
} from "../types/freestyler.types";

type AdminFreestylerFormProps = {
  countries: AdminFreestylerFormOptions["countries"];
  initialValues?: AdminFreestylerFormValues;
};

const inputStyles =
  "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]";

export function AdminFreestylerForm({
  countries,
  initialValues,
}: AdminFreestylerFormProps) {
  const isEditing = Boolean(initialValues);

  const formAction = initialValues
    ? updateFreestyler.bind(null, initialValues.id)
    : createFreestyler;

  return (
    <form
      action={formAction}
      className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="font-bold">
            Nombre artístico *
          </span>

          <input
            type="text"
            name="stageName"
            required
            defaultValue={initialValues?.stageName}
            className={inputStyles}
            placeholder="Ej. MC Demo"
          />
        </label>

        <label className="block">
          <span className="font-bold">
            Nombre real
          </span>

          <input
            type="text"
            name="realName"
            defaultValue={initialValues?.realName}
            className={inputStyles}
            placeholder="Nombre completo"
          />
        </label>

        <label className="block">
          <span className="font-bold">
            AKA
          </span>

          <input
            type="text"
            name="aka"
            defaultValue={initialValues?.aka}
            className={inputStyles}
            placeholder="Alias adicionales"
          />
        </label>

        <label className="block">
          <span className="font-bold">
            Slug *
          </span>

          <input
            type="text"
            name="slug"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            defaultValue={initialValues?.slug}
            className={inputStyles}
            placeholder="mc-demo"
          />

          <span className="mt-2 block text-sm text-[var(--color-muted)]">
            Utiliza letras minúsculas, números y guiones.
          </span>
        </label>

        <label className="block md:col-span-2">
          <span className="font-bold">
            Biografía
          </span>

          <textarea
            name="bio"
            rows={6}
            defaultValue={initialValues?.bio}
            className={inputStyles}
            placeholder="Información pública del freestyler."
          />
        </label>

        <label className="block">
          <span className="font-bold">
            Fecha de nacimiento
          </span>

          <input
            type="date"
            name="birthDate"
            defaultValue={initialValues?.birthDate}
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

        <label className="block">
          <span className="font-bold">
            País *
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
            Ciudad
          </span>

          <input
            type="text"
            name="city"
            defaultValue={initialValues?.city}
            className={inputStyles}
            placeholder="Ciudad de México"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="font-bold">
            Ruta de fotografía
          </span>

          <input
            type="text"
            name="photoPath"
            defaultValue={initialValues?.photoPath}
            className={inputStyles}
            placeholder="freestylers/photos/mc-demo.webp"
          />

          <span className="mt-2 block text-sm text-[var(--color-muted)]">
            Ruta del archivo dentro del bucket public-media.
          </span>
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
            TikTok
          </span>

          <input
            type="url"
            name="tiktokUrl"
            defaultValue={initialValues?.tiktokUrl}
            className={inputStyles}
            placeholder="https://tiktok.com/@..."
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

        <label className="block">
          <span className="font-bold">
            Twitch
          </span>

          <input
            type="url"
            name="twitchUrl"
            defaultValue={initialValues?.twitchUrl}
            className={inputStyles}
            placeholder="https://twitch.tv/..."
          />
        </label>

        <label className="block md:col-span-2">
          <span className="font-bold">
            X / Twitter
          </span>

          <input
            type="url"
            name="xUrl"
            defaultValue={initialValues?.xUrl}
            className={inputStyles}
            placeholder="https://x.com/..."
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
            : "Crear freestyler"}
        </button>

        <Link
          href="/admin/freestylers"
          className="rounded-full border border-[var(--color-border)] px-6 py-3 font-bold transition hover:border-[var(--color-primary)]"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}