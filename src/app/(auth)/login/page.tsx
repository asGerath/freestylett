import Link from "next/link";
import { signIn } from "@/features/auth/actions/auth.actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, message } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-12">
      <section className="w-full rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Freestyle Total
        </p>

        <h1 className="mt-3 text-3xl font-black">Iniciar sesión</h1>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {message && (
          <p className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
            {message}
          </p>
        )}

        <form action={signIn} className="mt-6 space-y-4">
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
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none focus:border-[var(--color-primary)]"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-[var(--color-primary-bright)] px-5 py-3 font-black text-[var(--color-text-dark)] transition hover:bg-[var(--color-primary-soft)]"
          >
            ENTRAR
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
          ¿No tienes cuenta?{" "}
          <Link
            href="/registro"
            className="font-bold text-[var(--color-primary)]"
          >
            Regístrate
          </Link>
        </p>
      </section>
    </main>
  );
}