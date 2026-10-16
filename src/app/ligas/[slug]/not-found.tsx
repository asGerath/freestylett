import Link from "next/link";

import { Container } from "@/components/ui/Container";

export default function LeagueNotFound() {
  return (
    <main className="py-10">
      <Container>
        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
            Liga no encontrada
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Esta liga no está disponible
          </h1>

          <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
            La liga puede no existir, permanecer en borrador o haber sido
            archivada.
          </p>

          <Link
            href="/ligas"
            className="mt-6 inline-flex rounded-full bg-[var(--color-primary)] px-6 py-3 font-bold text-white transition-opacity hover:opacity-90"
          >
            Ver todas las ligas
          </Link>
        </section>
      </Container>
    </main>
  );
}