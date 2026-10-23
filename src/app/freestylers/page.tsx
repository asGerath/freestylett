import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { FreestylerRoster } from "@/features/freestylers/components/FreestylerRoster";
import { getFreestylers } from "@/features/freestylers/services/freestyler.service";

const description =
  "Conoce perfiles, trayectorias y participantes del circuito freestyle.";

export const metadata: Metadata = {
  title: "Freestylers",
  description,
  alternates: {
    canonical: "/freestylers",
  },
  openGraph: {
    type: "website",
    title: "Freestylers | Freestyle Total",
    description,
    url: "/freestylers",
    images: [
      {
        url: "/images/brand/logo-primary.webp",
        alt: "Freestylers en Freestyle Total",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Freestylers | Freestyle Total",
    description,
    images: ["/images/brand/logo-primary.webp"],
  },
};

export default async function FreestylersPage() {
  const freestylers = await getFreestylers();

  return (
    <main className="py-10">
      <Container>
        {freestylers.length > 0 ? (
          <FreestylerRoster freestylers={freestylers} />
        ) : (
          <section aria-labelledby="freestylers-title">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Competidores
            </p>
            <h1
              id="freestylers-title"
              className="mt-1 text-4xl font-black tracking-tight"
            >
              Roster de freestylers
            </h1>
            <div className="mt-8 rounded-3xl border border-dashed border-[var(--color-border)] bg-white px-6 py-14 text-center">
              <h2 className="text-xl font-black">
                Todavía no hay freestylers publicados
              </h2>
              <p className="mt-2 text-[var(--color-muted)]">
                Los perfiles aparecerán aquí cuando estén disponibles.
              </p>
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}
