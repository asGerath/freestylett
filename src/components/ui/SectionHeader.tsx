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
    <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <span className="mb-3 block text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-primary)]">
          Explora la escena
        </span>
        <h2 className="text-3xl font-black tracking-tight text-[var(--color-text)] sm:text-4xl">
          {title}
        </h2>

        {description && (
          <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
            {description}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="w-fit rounded-full border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-bold text-[var(--color-primary)] shadow-sm transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
