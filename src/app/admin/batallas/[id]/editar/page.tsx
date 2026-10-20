import Link from "next/link";
import { notFound } from "next/navigation";

import { updateBattle } from "@/features/battles/actions/admin-battle.actions";
import { AdminBattleForm } from "@/features/battles/components/AdminBattleForm";
import {
  getAdminBattleById,
  getAdminBattleFormOptions,
} from "@/features/battles/services/admin-battle.service";

type EditBattlePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditBattlePage({
  params,
  searchParams,
}: EditBattlePageProps) {
  const [{ id }, { error }] = await Promise.all([
    params,
    searchParams,
  ]);

  const [battle, options] = await Promise.all([
    getAdminBattleById(id),
    getAdminBattleFormOptions(),
  ]);

  if (!battle) {
    notFound();
  }

  const formAction = updateBattle.bind(null, battle.id);

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
          Editar batalla
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          Modifica la información de {battle.title}.
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

      <AdminBattleForm
        events={options.events}
        seasons={options.seasons}
        formAction={formAction}
        initialValues={battle}
      />
    </main>
  );
}
