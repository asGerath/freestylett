"use client";

import { Container } from "@/components/ui/Container";

type CreatorsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CreatorsError({ reset }: CreatorsErrorProps) {
  return (
    <main className="py-10">
      <Container>
        <section
          role="alert"
          className="rounded-3xl border border-[var(--color-border)] bg-white p-8 shadow-sm"
        >
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
            Error de conexión
          </p>
          <h1 className="mt-3 text-3xl font-black">
            No pudimos cargar los creadores
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
            Ocurrió un problema al consultar la información. Puedes intentarlo nuevamente.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full bg-[var(--color-primary)] px-6 py-3 font-bold text-white transition hover:opacity-90"
          >
            Reintentar
          </button>
        </section>
      </Container>
    </main>
  );
}
