// Preview de freestylers para Home

import { freestylersMock } from "../data/freestylers.mock";
import { FreestylerCard } from "./FreestylerCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function FreestylersPreview() {
  const preview = freestylersMock.slice(0, 3);

  return (
    <section className="mt-16">
        <SectionHeader
          title="Freestylers"
          description="Perfiles destacados del circuito."
          href="/freestylers"
          linkLabel="Ver todos los freestylers →"
        />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {preview.map((f) => (
          <FreestylerCard key={f.id} freestyler={f} />
        ))}
      </div>
    </section>
  );
}