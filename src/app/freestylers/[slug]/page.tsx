import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { getFreestylerBySlug } from "@/features/freestylers/services/freestyler.service";

type FreestylerDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: FreestylerDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const freestyler = await getFreestylerBySlug(slug);

  if (!freestyler) {
    return {
      title: "Freestyler no encontrado",
      description: "El perfil solicitado no está disponible.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description =
    freestyler.bio ??
    `Conoce el perfil y la trayectoria de ${freestyler.name} en Freestyle Total.`;

  const image =
    freestyler.photoUrl ?? "/images/brand/logo-primary.webp";

  const canonicalPath = `/freestylers/${freestyler.slug}`;

  return {
    title: freestyler.name,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "profile",
      title: `${freestyler.name} | Freestyle Total`,
      description,
      url: canonicalPath,
      images: [
        {
          url: image,
          alt: freestyler.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${freestyler.name} | Freestyle Total`,
      description,
      images: [image],
    },
  };
}

export default async function FreestylerDetailPage({
  params,
}: FreestylerDetailPageProps) {
  const { slug } = await params;
  const freestyler = await getFreestylerBySlug(slug);

  if (!freestyler) {
    notFound();
  }

  const location = [freestyler.city, freestyler.country]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="py-10">
      <Container>
        <span className="text-sm font-bold text-[var(--color-primary)]">
          {freestyler.country}
        </span>

        <h1 className="mt-3 text-4xl font-bold">
          {freestyler.name}
        </h1>

        {freestyler.aka && (
          <p className="mt-2 text-xl text-[var(--color-accent)]">
            AKA: {freestyler.aka}
          </p>
        )}

        <p className="mt-4 text-[var(--color-muted)]">
          {location}
        </p>

        <section className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Trayectoria</h2>

          <p className="mt-3 text-[var(--color-muted)]">
            {freestyler.bio ??
              "La información de este freestyler se publicará próximamente."}
          </p>
        </section>
      </Container>
    </main>
  );
}