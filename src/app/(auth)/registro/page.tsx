import Link from "next/link";
import { signUp } from "@/features/auth/actions/auth.actions";

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-12">
      <section className="w-full rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Freestyle Total
        </p>

        <h1 className="mt-3 text-3xl font-black">Crear cuenta</h1>

        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Crea tu perfil para acceder a las funciones de la plataforma.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <form action={signUp} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">Nombre</span>
            <input
              name="displayName"
              type="text"
              required
              autoComplete="name"
              className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none focus:border-[var(--color-primary)]"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">Correo electrónico</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none focus:border-[var(--color-primary)]"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">Contraseña</span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none focus:border-[var(--color-primary)]"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-[var(--color-primary-bright)] px-5 py-3 font-black text-[var(--color-text-dark)] transition hover:bg-[var(--color-primary-soft)]"
          >
            CREAR CUENTA
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-bold text-[var(--color-primary)]">
            Inicia sesión
          </Link>
        </p>
      </section>
    </main>
  );
}