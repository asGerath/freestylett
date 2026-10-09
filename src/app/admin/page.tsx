import Link from "next/link";

import { getCurrentUser } from "@/features/auth/services/auth.service";

export default async function AdminPage() {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Panel editorial
        </p>

        <h1 className="mt-3 text-3xl font-black">
          Administración de contenido
        </h1>

        <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
          Hola, {user?.displayName}. Desde este panel podrás administrar
          eventos, ligas, freestylers y artículos.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Eventos", "Ligas", "Freestylers", "Artículos"].map(
            (section) => (
              <div
                key={section}
                className="rounded-2xl border border-[var(--color-border)] p-5"
              >
                <h2 className="font-bold">{section}</h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Administración próximamente.
                </p>
              </div>
            ),
          )}
        </div>

        <Link
          href="/dashboard"
          className="mt-8 inline-flex font-bold text-[var(--color-primary)]"
        >
          Volver al dashboard
        </Link>
      </section>
    </main>
  );
}