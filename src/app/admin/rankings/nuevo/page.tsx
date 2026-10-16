import Link from "next/link";

import { AdminRankingForm } from "@/features/rankings/components/AdminRankingForm";
import { getAdminRankingFormOptions } from "@/features/rankings/services/admin-ranking.service";

type NewRankingPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewRankingPage({
  searchParams,
}: NewRankingPageProps) {
  const [options, params] = await Promise.all([
    getAdminRankingFormOptions(),
    searchParams,
  ]);

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
          Crear clasificación
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          Registra una nueva captura de posiciones para una
          temporada.
        </p>
      </header>

      {params.error && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700"
        >
          {params.error}
        </div>
      )}

      {options.seasons.length === 0 ? (
        <div
          role="alert"
          className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800"
        >
          No existen temporadas disponibles. Registra o activa
          una temporada antes de crear clasificaciones.
        </div>
      ) : (
        <AdminRankingForm seasons={options.seasons} />
      )}
    </main>
  );
}