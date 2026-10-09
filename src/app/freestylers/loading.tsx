import { Container } from "@/components/ui/Container";

export default function FreestylersLoading() {
  return (
    <main className="py-10">
      <Container>
        <div className="h-10 w-52 animate-pulse rounded-lg bg-slate-200" />

        <div className="mt-3 h-6 w-full max-w-xl animate-pulse rounded bg-slate-200" />

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-2xl border border-[var(--color-border)] bg-white"
            />
          ))}
        </div>
      </Container>
    </main>
  );
}