import Link from "next/link";
import { redirect } from "next/navigation";

import { signOut } from "@/features/auth/actions/auth.actions";
import {
  canAccessEditorialPanel,
  getCurrentUser,
} from "@/features/auth/services/auth.service";

const roleLabels = {
  user: "Usuario",
  editor: "Editor",
  admin: "Administrador",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const canEdit = canAccessEditorialPanel(user);

  const visibleRoles =
    user.roles.length > 0
      ? user.roles.map((role) => roleLabels[role])
      : ["Usuario"];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Dashboard
        </p>

        <h1 className="mt-3 text-3xl font-black">
          Hola, {user.displayName}
        </h1>

        {user.email && (
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {user.email}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {visibleRoles.map((role) => (
            <span
              key={role}
              className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700"
            >
              {role}
            </span>
          ))}
        </div>

        <p className="mt-6 text-[var(--color-muted)]">
          Desde aquí podrás administrar tus preferencias, seguimientos y
          notificaciones.
        </p>

        {canEdit && (
          <section className="mt-8 rounded-2xl border border-[var(--color-primary)]/30 bg-cyan-50 p-5">
            <p className="font-bold text-[var(--color-primary)]">
              Acceso editorial habilitado
            </p>

            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Tu cuenta puede crear y actualizar contenido editorial.
            </p>

            <Link
              href="/admin"
              className="mt-4 inline-flex rounded-full bg-[var(--color-primary)] px-5 py-3 font-bold text-white transition-opacity hover:opacity-90"
            >
              IR AL PANEL EDITORIAL
            </Link>
          </section>
        )}

        <form action={signOut} className="mt-8">
          <button
            type="submit"
            className="rounded-full border border-[var(--color-border)] px-5 py-3 font-bold transition hover:border-red-300 hover:text-red-600"
          >
            CERRAR SESIÓN
          </button>
        </form>
      </section>
    </main>
  );
}