import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { CreatorCard } from "@/features/creators/components/CreatorCard";
import { getCreators } from "@/features/creators/services/creator.service";
import type { CreatorType } from "@/features/creators/types/creator.types";

const description =
  "Descubre personas, canales y medios que documentan y amplifican la cultura freestyle.";

export const metadata: Metadata = {
  title: "Creadores",
  description,
  alternates: {
    canonical: "/creadores",
  },
  openGraph: {
    type: "website",
    title: "Creadores | Freestyle Total",
    description,
    url: "/creadores",
    images: [
      {
        url: "/images/brand/logo-primary.webp",
        alt: "Creadores en Freestyle Total",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Creadores | Freestyle Total",
    description,
    images: ["/images/brand/logo-primary.webp"],
  },
};

type CreatorsPageProps = {
  searchParams: Promise<{
    tipo?: string;
    pais?: string;
  }>;
};

const typeLabels: Record<CreatorType, string> = {
  person: "Personas",
  channel: "Canales",
  media: "Medios",
};

export default async function CreatorsPage({
  searchParams,
}: CreatorsPageProps) {
  const [creators, params] = await Promise.all([
    getCreators(),
    searchParams,
  ]);

  const selectedType = ["person", "channel", "media"].includes(
    params.tipo ?? "",
  )
    ? (params.tipo as CreatorType)
    : undefined;

  const countries = Array.from(
    new Set(
      creators
        .map((creator) => creator.country)
        .filter((country): country is string => Boolean(country)),
    ),
  ).sort((first, second) =>
    first.localeCompare(second, "es"),
  );

  const filteredCreators = creators.filter((creator) => {
    const matchesType =
      !selectedType || creator.type === selectedType;
    const matchesCountry =
      !params.pais || creator.country === params.pais;

    return matchesType && matchesCountry;
  });

  return (
    <main className="py-10">
      <Container>
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Cultura y comunidad
        </p>

        <h1 className="mt-3 text-4xl font-black">Creadores</h1>

        <p className="mt-3 max-w-3xl text-[var(--color-muted)]">
          Conoce a quienes informan, analizan, entrevistan y documentan la
          escena del freestyle.
        </p>

        <form className="mt-8 grid gap-4 rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:grid-cols-[1fr_1fr_auto]">
          <label>
            <span className="text-sm font-bold">Tipo</span>
            <select
              name="tipo"
              defaultValue={selectedType ?? ""}
              className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3"
            >
              <option value="">Todos</option>
              {Object.entries(typeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-sm font-bold">País</span>
            <select
              name="pais"
              defaultValue={params.pais ?? ""}
              className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3"
            >
              <option value="">Todos</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="self-end rounded-full bg-[var(--color-primary)] px-6 py-3 font-bold text-white"
          >
            Filtrar
          </button>
        </form>

        {filteredCreators.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCreators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center">
            <h2 className="text-xl font-bold">
              No hay creadores para estos filtros
            </h2>
            <p className="mt-2 text-[var(--color-muted)]">
              Prueba otra combinación o vuelve próximamente.
            </p>
          </div>
        )}
      </Container>
    </main>
  );
}
