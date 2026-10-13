"use client";

import Link from "next/link";

import {
  createBlogPost,
  updateBlogPost,
} from "../actions/admin-blog.actions";
import type {
  AdminBlogPostFormOptions,
  AdminBlogPostFormValues,
} from "../types/blog.types";

type AdminBlogPostFormProps = {
  categories: AdminBlogPostFormOptions["categories"];
  initialValues?: AdminBlogPostFormValues;
};

const inputStyles =
  "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]";

export function AdminBlogPostForm({
  categories,
  initialValues,
}: AdminBlogPostFormProps) {
  const isEditing = Boolean(initialValues);

  const formAction = initialValues
    ? updateBlogPost.bind(null, initialValues.id)
    : createBlogPost;

  return (
    <form
      action={formAction}
      className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="font-bold">
            Título *
          </span>

          <input
            type="text"
            name="title"
            required
            defaultValue={initialValues?.title}
            className={inputStyles}
            placeholder="Ej. Resumen de la jornada nacional"
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
            placeholder="resumen-jornada-nacional"
          />

          <span className="mt-2 block text-sm text-[var(--color-muted)]">
            Utiliza letras minúsculas, números y guiones.
          </span>
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
            Extracto *
          </span>

          <textarea
            name="excerpt"
            rows={4}
            required
            defaultValue={initialValues?.excerpt}
            className={inputStyles}
            placeholder="Resumen breve que aparecerá en las tarjetas y resultados."
          />
        </label>

        <label className="block md:col-span-2">
          <span className="font-bold">
            Contenido Markdown
          </span>

          <textarea
            name="contentMarkdown"
            rows={14}
            defaultValue={initialValues?.contentMarkdown}
            className={`${inputStyles} font-mono text-sm`}
            placeholder={`# Título del contenido

Escribe aquí el cuerpo del artículo utilizando Markdown.`}
          />

          <span className="mt-2 block text-sm text-[var(--color-muted)]">
            Es obligatorio cuando el estado sea Publicado.
          </span>
        </label>

        <label className="block">
          <span className="font-bold">
            Categoría *
          </span>

          <select
            name="categoryId"
            required
            defaultValue={initialValues?.categoryId ?? ""}
            className={inputStyles}
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="font-bold">
            Ruta de portada
          </span>

          <input
            type="text"
            name="coverPath"
            defaultValue={initialValues?.coverPath}
            className={inputStyles}
            placeholder="blog/covers/resumen-jornada.webp"
          />

          <span className="mt-2 block text-sm text-[var(--color-muted)]">
            Ruta relativa dentro del bucket public-media.
          </span>
        </label>

        <label className="block md:col-span-2">
          <span className="font-bold">
            Título SEO
          </span>

          <input
            type="text"
            name="seoTitle"
            defaultValue={initialValues?.seoTitle}
            className={inputStyles}
            placeholder="Título para buscadores y redes sociales"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="font-bold">
            Descripción SEO
          </span>

          <textarea
            name="seoDescription"
            rows={3}
            defaultValue={initialValues?.seoDescription}
            className={inputStyles}
            placeholder="Descripción breve para buscadores y redes sociales."
          />
        </label>

        <label className="block md:col-span-2">
          <span className="font-bold">
            URL de la fuente
          </span>

          <input
            type="url"
            name="sourceUrl"
            defaultValue={initialValues?.sourceUrl}
            className={inputStyles}
            placeholder="https://..."
          />

          <span className="mt-2 block text-sm text-[var(--color-muted)]">
            Úsala cuando el artículo dependa de una fuente externa.
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
            : "Crear artículo"}
        </button>

        <Link
          href="/admin/articulos"
          className="rounded-full border border-[var(--color-border)] px-6 py-3 font-bold transition hover:border-[var(--color-primary)]"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}