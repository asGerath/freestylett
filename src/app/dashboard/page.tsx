import { redirect } from "next/navigation";
import { signOut } from "@/features/auth/actions/auth.actions";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_path")
    .eq("id", userId)
    .single();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Dashboard
        </p>

        <h1 className="mt-3 text-3xl font-black">
          Hola, {profile?.display_name ?? "usuario"}
        </h1>

        <p className="mt-3 text-[var(--color-muted)]">
          Desde aquí podrás administrar tus preferencias, seguimientos y
          notificaciones.
        </p>

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