import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminRankingForm } from "@/features/rankings/components/AdminRankingForm";
import {
  getAdminRankingById,
  getAdminRankingFormOptions,
} from "@/features/rankings/services/admin-ranking.service";

type EditRankingPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditRankingPage({
  params,
  searchParams,
}: EditRankingPageProps) {
  const [{ id }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  const [ranking, options] = await Promise.all([
    getAdminRankingById(id),
    getAdminRankingFormOptions(),
  ]);

  if (!ranking) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <Link
        href="/admin/rankings"
        className="text-sm font-bold text-[var(--color-primary)]"
      >
        ← Volver a clasificaciones
      </Link>

      <header className="mt-6">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Panel editorial
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Editar clasificación
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          Actualiza los datos generales y el estado de la
          clasificación.
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

      {options.seasons.length === 0 ? (
        <div
          role="alert"
          className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800"
        >
          No existen temporadas disponibles para editar esta
          clasificación.
        </div>
      ) : (
        <AdminRankingForm
          seasons={options.seasons}
          initialValues={ranking}
        />
      )}
    </main>
  );
}