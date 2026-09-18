import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[60vh] items-center py-16">
      <Container>
        <section className="mx-auto max-w-2xl rounded-[2rem] border border-[var(--color-border)] bg-white p-8 text-center shadow-sm sm:p-12">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">Error 404</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Esta página salió de la batalla</h1>
          <p className="mt-4 text-[var(--color-muted)]">El contenido que buscas no existe, cambió de dirección o todavía no está disponible.</p>
          <Link href="/" className="mt-8 inline-flex rounded-full bg-[var(--color-primary)] px-6 py-3 font-bold text-white transition hover:bg-[var(--color-primary-bright)] hover:text-[var(--color-text-dark)]">Volver al inicio</Link>
        </section>
      </Container>
    </main>
  );
}
