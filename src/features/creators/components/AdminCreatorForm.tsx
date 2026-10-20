"use client";

import Link from "next/link";

import {
  createCreator,
  updateCreator,
} from "../actions/admin-creator.actions";
import type {
  AdminCreatorFormOptions,
  AdminCreatorFormValues,
} from "../types/creator.types";

type AdminCreatorFormProps = {
  countries: AdminCreatorFormOptions["countries"];
  initialValues?: AdminCreatorFormValues;
};

const inputStyles =
  "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]";

export function AdminCreatorForm({
  countries,
  initialValues,
}: AdminCreatorFormProps) {
  const formAction = initialValues
    ? updateCreator.bind(null, initialValues.id)
    : createCreator;

  return (
    <form
      action={formAction}
      className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="font-bold">Nombre público *</span>
          <input
            type="text"
            name="name"
            required
            defaultValue={initialValues?.name}
            className={inputStyles}
            placeholder="Ej. Canal Demo"
          />
        </label>

        <label className="block">
          <span className="font-bold">Tipo *</span>
          <select
            name="type"
            required
            defaultValue={initialValues?.type ?? "person"}
            className={inputStyles}
          >
            <option value="person">Persona</option>
            <option value="channel">Canal</option>
            <option value="media">Medio</option>
          </select>
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
            placeholder="canal-demo"
          />
          <span className="mt-2 block text-sm text-[var(--color-muted)]">
            Utiliza letras minúsculas, números y guiones.
          </span>
        </label>

        <label className="block">
          <span className="font-bold">Usuario o handle</span>
          <input
            type="text"
            name="handle"
            defaultValue={initialValues?.handle}
            className={inputStyles}
            placeholder="@canaldemo"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="font-bold">Descripción</span>
          <textarea
            name="description"
            rows={6}
            defaultValue={initialValues?.description}
            className={inputStyles}
            placeholder="Trayectoria, enfoque y aportación al freestyle."
          />
        </label>

        <label className="block">
          <span className="font-bold">País</span>
          <select
            name="countryId"
            defaultValue={initialValues?.countryId ?? ""}
            className={inputStyles}
          >
            <option value="">Internacional / sin definir</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="font-bold">Ciudad</span>
          <input
            type="text"
            name="city"
            defaultValue={initialValues?.city}
            className={inputStyles}
            placeholder="Ciudad de México"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="font-bold">Especialidades</span>
          <input
            type="text"
            name="specialties"
            defaultValue={initialValues?.specialties}
            className={inputStyles}
            placeholder="entrevistas, análisis, noticias"
          />
          <span className="mt-2 block text-sm text-[var(--color-muted)]">
            Separa cada especialidad con una coma.
          </span>
        </label>

        <label className="block md:col-span-2">
          <span className="font-bold">Ruta de imagen</span>
          <input
            type="text"
            name="imagePath"
            defaultValue={initialValues?.imagePath}
            className={inputStyles}
            placeholder="creators/uuid/profile.webp"
          />
          <span className="mt-2 block text-sm text-[var(--color-muted)]">
            Ruta dentro del bucket public-media.
          </span>
        </label>

        {[
          ["websiteUrl", "Sitio web", "https://example.com"],
          ["youtubeUrl", "YouTube", "https://youtube.com/@..."],
          ["instagramUrl", "Instagram", "https://instagram.com/..."],
          ["tiktokUrl", "TikTok", "https://tiktok.com/@..."],
          ["twitchUrl", "Twitch", "https://twitch.tv/..."],
          ["xUrl", "X / Twitter", "https://x.com/..."],
        ].map(([name, label, placeholder]) => (
          <label key={name} className="block">
            <span className="font-bold">{label}</span>
            <input
              type="url"
              name={name}
              defaultValue={
                initialValues?.[
                  name as
                    | "websiteUrl"
                    | "youtubeUrl"
                    | "instagramUrl"
                    | "tiktokUrl"
                    | "twitchUrl"
                    | "xUrl"
                ]
              }
              className={inputStyles}
              placeholder={placeholder}
            />
          </label>
        ))}

        <label className="block md:col-span-2">
          <span className="font-bold">Fuente de verificación</span>
          <input
            type="url"
            name="sourceUrl"
            defaultValue={initialValues?.sourceUrl}
            className={inputStyles}
            placeholder="https://..."
          />
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

        <label className="flex items-center gap-3 self-end rounded-xl border border-[var(--color-border)] px-4 py-3">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={initialValues?.isFeatured}
            className="size-5 accent-[var(--color-primary)]"
          />
          <span className="font-bold">Mostrar como destacado</span>
        </label>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="submit"
          className="cursor-pointer rounded-full bg-[var(--color-primary)] px-6 py-3 font-bold text-white transition hover:opacity-90"
        >
          {initialValues ? "Guardar cambios" : "Crear creador"}
        </button>

        <Link
          href="/admin/creadores"
          className="rounded-full border border-[var(--color-border)] px-6 py-3 font-bold transition hover:border-[var(--color-primary)]"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
