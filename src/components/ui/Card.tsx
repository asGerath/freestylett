type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <article
      className={`h-full overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_18px_50px_rgba(11,24,32,0.09)] transition duration-300 hover:-translate-y-1.5 hover:border-[var(--color-primary)] hover:shadow-[0_24px_60px_rgba(11,24,32,0.14)] ${className}`}
    >
      {children}
    </article>
  );
}
