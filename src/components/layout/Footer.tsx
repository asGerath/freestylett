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
    <footer className="mt-16 border-t border-white/10 bg-black/50">
      <Container>
        <div className="flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
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
            <p className="mt-3 max-w-sm text-sm text-[var(--color-muted)]">
              Eventos, ligas, freestylers y noticias del freestyle hispano en
              un solo lugar.
            </p>
          </div>

          <nav aria-label="Navegación del pie de página">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-300 transition hover:text-[var(--color-primary)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-white/10 py-5 text-xs text-[var(--color-muted)]">
          © {new Date().getFullYear()} FreeStyle Total. Todos los derechos
          reservados.
        </div>
      </Container>
    </footer>
  );
}
