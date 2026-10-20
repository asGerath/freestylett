import Link from "next/link";

import { AdminCreatorForm } from "@/features/creators/components/AdminCreatorForm";
import { getAdminCreatorFormOptions } from "@/features/creators/services/admin-creator.service";

type NewCreatorPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewCreatorPage({
  searchParams,
}: NewCreatorPageProps) {
  const [options, params] = await Promise.all([
    getAdminCreatorFormOptions(),
    searchParams,
  ]);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <Link
        href="/admin/creadores"
        className="text-sm font-bold text-[var(--color-primary)]"
      >
        ← Volver a creadores
      </Link>

      <header className="mt-6">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Panel editorial
        </p>
        <h1 className="mt-2 text-3xl font-black">
          Crear perfil
        </h1>
        <p className="mt-2 text-[var(--color-muted)]">
          Registra una persona, canal o medio del ecosistema.
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

      <AdminCreatorForm countries={options.countries} />
    </main>
  );
}
