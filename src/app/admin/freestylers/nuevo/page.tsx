import Link from "next/link";

import { AdminFreestylerForm } from "@/features/freestylers/components/AdminFreestylerForm";
import { getAdminFreestylerFormOptions } from "@/features/freestylers/services/admin-freestyler.service";

type NewFreestylerPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewFreestylerPage({
  searchParams,
}: NewFreestylerPageProps) {
  const [options, params] = await Promise.all([
    getAdminFreestylerFormOptions(),
    searchParams,
  ]);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <Link
        href="/admin/freestylers"
        className="text-sm font-bold text-[var(--color-primary)]"
      >
        ← Volver a freestylers
      </Link>

      <header className="mt-6">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Panel editorial
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Crear freestyler
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          Registra un nuevo perfil dentro del ecosistema.
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

      {options.countries.length === 0 ? (
        <div
          role="alert"
          className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800"
        >
          No existen países activos. Activa al menos un país
          antes de crear freestylers.
        </div>
      ) : (
        <AdminFreestylerForm
          countries={options.countries}
        />
      )}
    </main>
  );
}