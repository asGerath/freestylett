import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminLeagueForm } from "@/features/leagues/components/AdminLeagueForm";
import {
  getAdminLeagueById,
  getAdminLeagueFormOptions,
} from "@/features/leagues/services/admin-league.service";

type EditLeaguePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditLeaguePage({
  params,
  searchParams,
}: EditLeaguePageProps) {
  const { id } = await params;

  const [league, options, query] = await Promise.all([
    getAdminLeagueById(id),
    getAdminLeagueFormOptions(),
    searchParams,
  ]);

  if (!league) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <Link
        href="/admin/ligas"
        className="text-sm font-bold text-[var(--color-primary)]"
      >
        ← Volver a ligas
      </Link>

      <header className="mt-6">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Panel editorial
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Editar liga
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          Modifica la información de {league.name}.
        </p>
      </header>

      {query.error && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700"
        >
          {query.error}
        </div>
      )}

      {options.countries.length === 0 ? (
        <div
          role="alert"
          className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800"
        >
          No existen países activos. Activa al menos un
          país antes de editar ligas.
        </div>
      ) : (
        <AdminLeagueForm
          countries={options.countries}
          initialValues={league}
        />
      )}
    </main>
  );
}