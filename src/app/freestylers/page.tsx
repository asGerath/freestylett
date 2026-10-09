import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { FreestylerCard } from "@/features/freestylers/components/FreestylerCard";
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
        <h1 className="text-4xl font-bold">Freestylers</h1>

        <p className="mt-3 text-[var(--color-muted)]">
          Conoce a los competidores del ecosistema freestyle.
        </p>

        {freestylers.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {freestylers.map((freestyler) => (
              <FreestylerCard
                key={freestyler.id}
                freestyler={freestyler}
              />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-[var(--color-muted)]">
            Todavía no hay freestylers publicados.
          </p>
        )}
      </Container>
    </main>
  );
}