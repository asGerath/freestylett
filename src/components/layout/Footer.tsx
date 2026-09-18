import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

const footerLinks = [
  { label: "Eventos", href: "/eventos" },
  { label: "Freestylers", href: "/freestylers" },
  { label: "Ligas", href: "/ligas" },
  { label: "Blog", href: "/blog" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--color-border)] bg-[var(--color-bg-deep)]">
      <Container>
        <div className="flex flex-col gap-10 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" aria-label="Ir al inicio de Freestyle Total">
              <Image
                src="/images/brand/logo-horizontal.webp"
                alt="Freestyle Total"
                width={2172}
                height={724}
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--color-muted)]">
              La escena completa: eventos, ligas, freestylers y noticias en un
              solo lugar.
            </p>
          </div>

          <nav aria-label="Navegación del pie de página">
            <ul className="flex flex-wrap gap-x-7 gap-y-3">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-semibold text-[var(--color-muted)] transition hover:text-[var(--color-primary)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-[var(--color-border)] py-6 text-xs text-[var(--color-muted)]">
          © {new Date().getFullYear()} FreeStyle Total. Todos los derechos
          reservados.
        </div>
      </Container>
    </footer>
  );
}
