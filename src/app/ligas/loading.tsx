import { Container } from "@/components/ui/Container";

export default function LeaguesLoading() {
  return (
    <main className="py-10">
      <Container>
        <div className="h-10 w-40 animate-pulse rounded-lg bg-slate-200" />

        <div className="mt-3 h-6 w-full max-w-2xl animate-pulse rounded bg-slate-200" />

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-56 animate-pulse rounded-2xl border border-[var(--color-border)] bg-white"
            />
          ))}
        </div>
      </Container>
    </main>
  );
}