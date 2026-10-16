import Link from "next/link";

import { Container } from "@/components/ui/Container";

export default function BlogPostNotFound() {
  return (
    <main className="py-10">
      <Container>
        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
            Artículo no encontrado
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Este artículo no está disponible
          </h1>

          <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
            El artículo puede no existir, permanecer en borrador o haber sido
            archivado.
          </p>

          <Link
            href="/blog"
            className="mt-6 inline-flex rounded-full bg-[var(--color-primary)] px-6 py-3 font-bold text-white transition-opacity hover:opacity-90"
          >
            Ver todos los artículos
          </Link>
        </section>
      </Container>
    </main>
  );
}