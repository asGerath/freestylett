import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminCreatorForm } from "@/features/creators/components/AdminCreatorForm";
import {
  getAdminCreatorById,
  getAdminCreatorFormOptions,
} from "@/features/creators/services/admin-creator.service";

type EditCreatorPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditCreatorPage({
  params,
  searchParams,
}: EditCreatorPageProps) {
  const { id } = await params;

  const [creator, options, query] = await Promise.all([
    getAdminCreatorById(id),
    getAdminCreatorFormOptions(),
    searchParams,
  ]);

  if (!creator) {
    notFound();
  }

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
          Editar creador
        </h1>
        <p className="mt-2 text-[var(--color-muted)]">
          Modifica la información de {creator.name}.
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

      <AdminCreatorForm
        countries={options.countries}
        initialValues={creator}
      />
    </main>
  );
}
