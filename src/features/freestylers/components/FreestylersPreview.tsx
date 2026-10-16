import { SectionHeader } from "@/components/ui/SectionHeader";

import { getFeaturedFreestylers } from "../services/freestyler.service";
import { FreestylerCard } from "./FreestylerCard";

export async function FreestylersPreview() {
  const freestylers = await getFeaturedFreestylers(3);

  return (
    <section className="mt-16">
      <SectionHeader
        title="Freestylers"
        description="Perfiles destacados del circuito."
        href="/freestylers"
        linkLabel="Ver todos los freestylers"
      />

      {freestylers.length > 0 ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {freestylers.map((freestyler) => (
            <FreestylerCard
              key={freestyler.id}
              freestyler={freestyler}
            />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-[var(--color-muted)]">
          Todavía no hay freestylers publicados.
        </p>
      )}
    </section>
  );
}