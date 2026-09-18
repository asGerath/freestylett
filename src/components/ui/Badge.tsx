type BadgeVariant = "primary" | "accent" | "muted";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
};

const badgeVariants: Record<BadgeVariant, string> = {
  primary: "bg-[var(--color-primary)] text-[var(--color-text-dark)]",
  accent: "bg-[var(--color-accent)] text-[var(--color-text-dark)]",
  muted: "border border-[var(--color-border)] bg-white/5 text-[var(--color-muted)]",
};

export function Badge({ children, variant = "primary" }: BadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${badgeVariants[variant]}`}
    >
      {children}
    </span>
  );
}
