// Card base reutilizable.
// Centraliza estilos comunes de contenedores tipo tarjeta.

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <article
      className={`h-full rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-[var(--color-accent)] hover:bg-white/10 ${className}`}
    >
      {children}
    </article>
  );
}