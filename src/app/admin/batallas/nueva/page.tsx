import Link from "next/link";

import { createBattle } from "@/features/battles/actions/admin-battle.actions";
import { AdminBattleForm } from "@/features/battles/components/AdminBattleForm";
import { getAdminBattleFormOptions } from "@/features/battles/services/admin-battle.service";

type NewBattlePageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewBattlePage({
  searchParams,
}: NewBattlePageProps) {
  const [options, params] = await Promise.all([
    getAdminBattleFormOptions(),
    searchParams,
  ]);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <Link
        href="/admin/batallas"
        className="text-sm font-bold text-[var(--color-primary)]"
      >
        ← Volver a batallas
      </Link>

      <header className="mt-6">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Panel editorial
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Crear batalla
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          Registra una batalla y relaciónala con su evento y
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

      {options.events.length === 0 ? (
        <div
          role="alert"
          className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800"
        >
          No existen eventos disponibles. Crea o activa un
          evento antes de registrar batallas.
        </div>
      ) : (
        <AdminBattleForm
          events={options.events}
          seasons={options.seasons}
          formAction={createBattle}
        />
      )}
    </main>
  );
}