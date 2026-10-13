import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminFreestylerForm } from "@/features/freestylers/components/AdminFreestylerForm";
import {
  getAdminFreestylerById,
  getAdminFreestylerFormOptions,
} from "@/features/freestylers/services/admin-freestyler.service";

type EditFreestylerPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditFreestylerPage({
  params,
  searchParams,
}: EditFreestylerPageProps) {
  const { id } = await params;

  const [freestyler, options, query] =
    await Promise.all([
      getAdminFreestylerById(id),
      getAdminFreestylerFormOptions(),
      searchParams,
    ]);

  if (!freestyler) {
    notFound();
  }

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
          Editar freestyler
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          Modifica la información de{" "}
          {freestyler.stageName}.
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
          No existen países activos. Activa al menos un país
          antes de editar freestylers.
        </div>
      ) : (
        <AdminFreestylerForm
          countries={options.countries}
          initialValues={freestyler}
        />
      )}
    </main>
  );
}