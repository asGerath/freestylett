// Navbar global de la aplicación.
// Vive en el layout para aparecer en todas las páginas.

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

const navItems = [
  {
    label: "Eventos",
    href: "/eventos",
  },
  {
    label: "Freestylers",
    href: "/freestylers",
  },
  {
    label: "Ligas",
    href: "/ligas",
  },
  {
    label: "Blog",
    href: "/blog",
  },
];

export function Navbar() {
  return (
    <header className="border-b border-white/10 bg-black/80">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          {/* Logo principal de la marca */}
          <Link
            href="/"
            aria-label="Ir al inicio de Freestyle Total"
            className="shrink-0"
          >
            <Image
              src="/images/brand/logo-horizontal.webp"
              alt="Freestyle Total"
              width={2172}
              height={724}
              priority
              className="h-11 w-auto"
            />
          </Link>

          {/* Links principales */}
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-gray-300 transition hover:text-[var(--color-accent)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </Container>
    </header>
  );
}
