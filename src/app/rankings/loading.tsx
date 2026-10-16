import { Container } from "@/components/ui/Container";

export default function RankingsLoading() {
  return (
    <main className="py-10">
      <Container>
        <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />

        <div className="mt-3 h-10 w-48 animate-pulse rounded-lg bg-slate-200" />

        <div className="mt-3 h-6 w-full max-w-3xl animate-pulse rounded bg-slate-200" />

        <div className="mt-8 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white">
          <div className="space-y-3 border-b border-[var(--color-border)] p-6">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
            <div className="h-8 w-72 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-56 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="space-y-1 p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}