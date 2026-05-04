// Página completa de freestylers

import { Container } from "@/components/ui/Container";
import { freestylersMock } from "@/features/freestylers/data/freestylers.mock";
import { FreestylerCard } from "@/features/freestylers/components/FreestylerCard";

export default function FreestylersPage() {
  return (
    <main className="py-10">
      <Container>
        <h1 className="text-4xl font-bold">Freestylers</h1>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {freestylersMock.map((f) => (
            <FreestylerCard key={f.id} freestyler={f} />
          ))}
        </div>
      </Container>
    </main>
  );
}