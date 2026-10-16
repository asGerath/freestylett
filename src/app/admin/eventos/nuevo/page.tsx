import Link from "next/link";

import { AdminEventForm } from "@/features/events/components/AdminEventForm";
import { getAdminEventFormOptions } from "@/features/events/services/admin-event.service";

type NewEventPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewEventPage({
  searchParams,
}: NewEventPageProps) {
  const [{ error }, options] = await Promise.all([
    searchParams,
    getAdminEventFormOptions(),
  ]);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <Link
        href="/admin/eventos"
        className="text-sm font-bold text-[var(--color-primary)]"
      >
        ← Volver a eventos
      </Link>

      <header className="mt-6">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Panel editorial
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Crear evento
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          Registra la información principal del evento. Puedes
          guardarlo como borrador antes de publicarlo.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700"
        >
          {error}
        </div>
      )}

      {options.countries.length === 0 ? (
        <div
          role="alert"
          className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800"
        >
          No existen países activos. Agrega al menos un país antes
          de crear eventos.
        </div>
      ) : (
        <AdminEventForm countries={options.countries} />
      )}
    </main>
  );
}