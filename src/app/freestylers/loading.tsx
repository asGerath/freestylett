import { Container } from "@/components/ui/Container";

export default function FreestylersLoading() {
  return (
    <main className="py-10">
      <Container>
        <div className="border-b border-[var(--color-border)] pb-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-3">
              <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
              <div className="h-10 w-72 max-w-full animate-pulse rounded-lg bg-slate-200" />
              <div className="h-5 w-full max-w-xl animate-pulse rounded bg-slate-200" />
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(16rem,1fr)_13rem] xl:w-[36rem]">
              <div className="h-12 animate-pulse rounded-full bg-slate-200" />
              <div className="h-12 animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>
        </div>

        <div className="mt-5 h-4 w-32 animate-pulse rounded bg-slate-200" />

        <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex h-44 animate-pulse gap-4 rounded-3xl border border-[var(--color-border)] bg-white p-3"
            >
              <div className="w-32 rounded-2xl bg-slate-200" />
              <div className="flex flex-1 flex-col gap-3 py-2">
                <div className="h-3 w-24 rounded bg-slate-200" />
                <div className="h-6 w-3/4 rounded bg-slate-200" />
                <div className="h-4 w-1/2 rounded bg-slate-200" />
                <div className="mt-auto h-8 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
