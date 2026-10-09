import Link from "next/link";

import { ArchiveEventButton } from "@/features/events/components/ArchiveEventButton";
import { getAdminEvents } from "@/features/events/services/admin-event.service";
import type {
  EventEditorialStatus,
  EventStatus,
} from "@/features/events/types/event.types";

const editorialStatusLabels: Record<EventEditorialStatus, string> = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
};

const editorialStatusStyles: Record<EventEditorialStatus, string> = {
  draft: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
  archived: "bg-slate-200 text-slate-700",
};

const eventStatusLabels: Record<
  Exclude<EventStatus, "draft">,
  string
> = {
  upcoming: "Próximo",
  live: "En vivo",
  finished: "Finalizado",
  cancelled: "Cancelado",
  postponed: "Pospuesto",
};

type AdminEventsPageProps = {
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

export default async function AdminEventsPage({
  searchParams,
}: AdminEventsPageProps) {
  const [events, params] = await Promise.all([
    getAdminEvents(),
    searchParams,
  ]);

  const successMessage = params.created
    ? "El evento fue creado correctamente."
    : params.updated
      ? "El evento fue actualizado correctamente."
      : params.archived
        ? "El evento fue archivado correctamente."
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
            Eventos
          </h1>

          <p className="mt-2 text-[var(--color-muted)]">
            Consulta y administra los eventos registrados.
          </p>
        </div>

        <Link
          href="/admin/eventos/nuevo"
          className="inline-flex w-fit items-center justify-center rounded-full bg-[var(--color-primary)] px-5 py-3 font-bold text-white transition hover:opacity-90"
        >
          Crear evento
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

      {events.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold">
            No hay eventos registrados
          </h2>

          <p className="mt-2 text-[var(--color-muted)]">
            Crea el primer evento desde el panel editorial.
          </p>
        </section>
      ) : (
        <section className="mt-8 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead className="bg-[var(--color-surface-soft)]">
                <tr>
                  <th className="px-5 py-4 text-sm font-bold">
                    Evento
                  </th>

                  <th className="px-5 py-4 text-sm font-bold">
                    Ubicación
                  </th>

                  <th className="px-5 py-4 text-sm font-bold">
                    Fecha
                  </th>

                  <th className="px-5 py-4 text-sm font-bold">
                    Estado
                  </th>

                  <th className="px-5 py-4 text-sm font-bold">
                    Publicación
                  </th>

                  <th className="px-5 py-4 text-right text-sm font-bold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="border-t border-[var(--color-border)]"
                  >
                    <td className="px-5 py-4">
                      <p className="font-bold">{event.title}</p>

                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        /{event.slug}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {event.city}, {event.country}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      <time dateTime={event.startsAt}>
                        {formatDate(event.startsAt)}
                      </time>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {eventStatusLabels[event.eventStatus]}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          editorialStatusStyles[
                            event.editorialStatus
                          ]
                        }`}
                      >
                        {
                          editorialStatusLabels[
                            event.editorialStatus
                          ]
                        }
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        {event.editorialStatus === "published" && (
                          <Link
                            href={`/eventos/${event.slug}`}
                            className="text-sm font-bold text-[var(--color-muted)] hover:text-[var(--color-text)]"
                          >
                            Ver
                          </Link>
                        )}

                        <Link
                          href={`/admin/eventos/${event.id}/editar`}
                          className="text-sm font-bold text-[var(--color-primary)]"
                        >
                          Editar
                        </Link>

                        {event.editorialStatus !== "archived" && (
                          <ArchiveEventButton
                            eventId={event.id}
                            eventTitle={event.title}
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