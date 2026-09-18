type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <article
      className={`h-full overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_24px_70px_rgba(1,12,18,0.24)] transition duration-300 hover:-translate-y-1.5 hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-raised)] ${className}`}
    >
      {children}
    </article>
  );
}
