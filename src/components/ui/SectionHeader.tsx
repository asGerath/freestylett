// Header reutilizable para secciones.
// Sirve para previews del Home y encabezados internos con CTA opcional.

import Link from "next/link";

type SectionHeaderProps = {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
};

export function SectionHeader({
  title,
  description,
  href,
  linkLabel = "Ver todos →",
  
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>

        {description && (
          <p className="mt-2 text-gray-400">
            {description}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="text-sm font-bold text-[var(--color-accent)] hover:underline"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}