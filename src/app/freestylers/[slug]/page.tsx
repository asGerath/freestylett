// Página de detalle de un freestyler.
// Next obtiene el slug desde la URL: /freestylers/aczino

import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { freestylersMock } from "@/features/freestylers/data/freestylers.mock";

type FreestylerDetailPageProps = {
  params: {
    slug: string;
  };
};

export default function FreestylerDetailPage({
  params,
}: FreestylerDetailPageProps) {
  // Buscamos el freestyler que coincida con el slug de la URL
  const freestyler = freestylersMock.find(
    (freestyler) => freestyler.slug === params.slug
  );

  // Si no existe, mandamos al 404 de Next
  if (!freestyler) {
    notFound();
  }

  return (
    <main className="py-10">
      <Container>
        {/* Nombre principal */}
        <h1 className="text-4xl font-bold">{freestyler.name}</h1>

        {/* Alias opcional */}
        {freestyler.aka && (
          <p className="mt-2 text-xl text-[var(--color-accent)]">
            AKA: {freestyler.aka}
          </p>
        )}

        {/* Ubicación */}
        <p className="mt-4 text-gray-400">
          {freestyler.city}, {freestyler.country}
        </p>

        {/* Texto temporal */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">Trayectoria</h2>

          <p className="mt-3 text-gray-400">
            Aquí mostraremos biografía, logros, participaciones, ranking,
            historial de eventos y estadísticas del freestyler.
          </p>
        </section>
      </Container>
    </main>
  );
}