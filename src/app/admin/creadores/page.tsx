import Link from "next/link";

import { ArchiveCreatorButton } from "@/features/creators/components/ArchiveCreatorButton";
import { getAdminCreators } from "@/features/creators/services/admin-creator.service";
import type {
  CreatorEditorialStatus,
  CreatorType,
} from "@/features/creators/types/creator.types";

const editorialStatusLabels: Record<
  CreatorEditorialStatus,
  string
> = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
};

const editorialStatusStyles: Record<
  CreatorEditorialStatus,
  string
> = {
  draft: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
  archived: "bg-slate-200 text-slate-700",
};

const typeLabels: Record<CreatorType, string> = {
  person: "Persona",
  channel: "Canal",
  media: "Medio",
};

type AdminCreatorsPageProps = {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    archived?: string;
    error?: string;
  }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminCreatorsPage({
  searchParams,
}: AdminCreatorsPageProps) {
  const [creators, params] = await Promise.all([
    getAdminCreators(),
    searchParams,
  ]);

  const successMessage = params.created
    ? "El creador fue creado correctamente."
    : params.updated
      ? "El creador fue actualizado correctamente."
      : params.archived
        ? "El creador fue archivado correctamente."
        : null;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/admin"
            className="text-sm font-bold text-[var(--color-primary)]"
          >
            ← Volver al panel
          </Link>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
            Panel editorial
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Creadores
          </h1>

          <p className="mt-2 text-[var(--color-muted)]">
            Administra personas, canales y medios de la escena.
          </p>
        </div>

        <Link
          href="/admin/creadores/nuevo"
          className="inline-flex w-fit items-center justify-center rounded-full bg-[var(--color-primary)] px-5 py-3 font-bold text-white transition hover:opacity-90"
        >
          Crear perfil
        </Link>
      </div>

      {successMessage && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800"
        >
          {successMessage}
        </div>
      )}

      {params.error && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700"
        >
          {params.error}
        </div>
      )}

      {creators.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold">
            No hay creadores registrados
          </h2>
          <p className="mt-2 text-[var(--color-muted)]">
            Crea el primer perfil desde el panel editorial.
          </p>
        </section>
      ) : (
        <section className="mt-8 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-left">
              <thead className="bg-[var(--color-surface-soft)]">
                <tr>
                  <th className="px-5 py-4 text-sm font-bold">
                    Creador
                  </th>
                  <th className="px-5 py-4 text-sm font-bold">
                    Tipo
                  </th>
                  <th className="px-5 py-4 text-sm font-bold">
                    País
                  </th>
                  <th className="px-5 py-4 text-sm font-bold">
                    Publicación
                  </th>
                  <th className="px-5 py-4 text-sm font-bold">
                    Actualización
                  </th>
                  <th className="px-5 py-4 text-right text-sm font-bold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {creators.map((creator) => (
                  <tr
                    key={creator.id}
                    className="border-t border-[var(--color-border)]"
                  >
                    <td className="px-5 py-4">
                      <p className="font-bold">{creator.name}</p>
                      {creator.handle && (
                        <p className="mt-1 text-sm text-[var(--color-muted)]">
                          {creator.handle}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        /{creator.slug}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {typeLabels[creator.type]}
                      {creator.isFeatured && (
                        <span className="ml-2 rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800">
                          Destacado
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {creator.country ?? "Internacional"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          editorialStatusStyles[
                            creator.editorialStatus
                          ]
                        }`}
                      >
                        {
                          editorialStatusLabels[
                            creator.editorialStatus
                          ]
                        }
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      <time dateTime={creator.updatedAt}>
                        {formatDate(creator.updatedAt)}
                      </time>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        {creator.editorialStatus === "published" && (
                          <Link
                            href={`/creadores/${creator.slug}`}
                            className="text-sm font-bold text-[var(--color-muted)] hover:text-[var(--color-text)]"
                          >
                            Ver
                          </Link>
                        )}

                        <Link
                          href={`/admin/creadores/${creator.id}/editar`}
                          className="text-sm font-bold text-[var(--color-primary)]"
                        >
                          Editar
                        </Link>

                        {creator.editorialStatus !== "archived" && (
                          <ArchiveCreatorButton
                            creatorId={creator.id}
                            creatorName={creator.name}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
