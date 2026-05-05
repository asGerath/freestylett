// Badge reutilizable para estados, categorías, etc.
// Ahora soporta variantes para distintos contextos visuales.

type BadgeVariant = "primary" | "accent" | "muted";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
};

const badgeVariants: Record<BadgeVariant, string> = {
  primary: "bg-yellow-400 text-black",
  accent: "bg-[var(--color-accent)] text-black",
  muted: "bg-white/10 text-gray-300",
};

export function Badge({ children, variant = "primary" }: BadgeProps) {
  return (
    <span
      className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-bold ${badgeVariants[variant]}`}
    >
      {children}
    </span>
  );
}