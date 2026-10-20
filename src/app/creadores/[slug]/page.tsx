import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { getCreatorBySlug } from "@/features/creators/services/creator.service";

type CreatorDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const typeLabels = {
  person: "Creador",
  channel: "Canal",
  media: "Medio",
};

export async function generateMetadata({
  params,
}: CreatorDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const creator = await getCreatorBySlug(slug);

  if (!creator) {
    return {
      title: "Creador no encontrado",
      description: "El perfil solicitado no está disponible.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description =
    creator.description ??
    `Conoce el perfil de ${creator.name} en Freestyle Total.`;
  const image =
    creator.imageUrl ?? "/images/brand/logo-primary.webp";
  const canonicalPath = `/creadores/${creator.slug}`;

  return {
    title: creator.name,
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
      title: `${creator.name} | Freestyle Total`,
      description,
      url: canonicalPath,
      images: [{ url: image, alt: creator.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${creator.name} | Freestyle Total`,
      description,
      images: [image],
    },
  };
}

export default async function CreatorDetailPage({
  params,
}: CreatorDetailPageProps) {
  const { slug } = await params;
  const creator = await getCreatorBySlug(slug);

  if (!creator) {
    notFound();
  }

  const location = [creator.city, creator.country]
    .filter(Boolean)
    .join(", ");

  const links = [
    ["Sitio oficial", creator.links.website],
    ["YouTube", creator.links.youtube],
    ["Instagram", creator.links.instagram],
    ["TikTok", creator.links.tiktok],
    ["Twitch", creator.links.twitch],
    ["X / Twitter", creator.links.x],
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <main className="py-10">
      <Container>
        <Link
          href="/creadores"
          className="font-bold text-[var(--color-primary)]"
        >
          ← Volver a creadores
        </Link>

        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[var(--color-primary-bright)] px-3 py-1 text-sm font-bold">
                {typeLabels[creator.type]}
              </span>
              {creator.isFeatured && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
                  Destacado
                </span>
              )}
            </div>

            <h1 className="mt-5 text-4xl font-black sm:text-5xl">
              {creator.name}
            </h1>

            {creator.handle && (
              <p className="mt-2 text-xl text-[var(--color-primary)]">
                {creator.handle}
              </p>
            )}

            {location && (
              <p className="mt-4 text-[var(--color-muted)]">
                {location}
              </p>
            )}

            <section className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black">Perfil</h2>
              <p className="mt-4 leading-7 text-[var(--color-muted)]">
                {creator.description ??
                  "La información de este creador se publicará próximamente."}
              </p>
            </section>

            {creator.specialties.length > 0 && (
              <section className="mt-6">
                <h2 className="text-xl font-black">
                  Especialidades
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {creator.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <div
              className="aspect-square rounded-2xl bg-[var(--color-surface-soft)] bg-cover bg-center"
              style={
                creator.imageUrl
                  ? {
                      backgroundImage: `url("${creator.imageUrl}")`,
                    }
                  : undefined
              }
            >
              {!creator.imageUrl && (
                <div className="flex h-full items-center justify-center text-7xl font-black text-[var(--color-primary)]">
                  {creator.name.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>

            <h2 className="mt-6 text-xl font-black">
              Enlaces oficiales
            </h2>

            {links.length > 0 ? (
              <div className="mt-4 flex flex-col gap-3">
                {links.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-[var(--color-border)] px-4 py-3 text-center font-bold transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  >
                    {label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-[var(--color-muted)]">
                Todavía no hay enlaces oficiales registrados.
              </p>
            )}

            {creator.sourceUrl && (
              <a
                href={creator.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 block text-sm font-bold text-[var(--color-primary)]"
              >
                Consultar fuente de verificación
              </a>
            )}
          </aside>
        </section>
      </Container>
    </main>
  );
}
