"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <Container>
        <nav
          className="flex h-16 items-center justify-between"
          aria-label="Navegación principal"
        >
          <Link
            href="/"
            aria-label="Ir al inicio de Freestyle Total"
            className="shrink-0"
            onClick={() => setIsOpen(false)}
          >
            <Image
              src="/images/brand/logo-horizontal.webp"
              alt="Freestyle Total"
              width={2172}
              height={724}
              priority
              className="h-10 w-auto sm:h-11"
            />
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`text-sm font-medium transition hover:text-[var(--color-accent)] ${
                  isActive(item.href)
                    ? "text-[var(--color-primary)]"
                    : "text-gray-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex size-10 items-center justify-center rounded-md border border-white/15 text-white transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] md:hidden"
          >
            <span aria-hidden="true" className="text-2xl leading-none">
              {isOpen ? "×" : "☰"}
            </span>
          </button>
        </nav>

        {isOpen && (
          <div
            id="mobile-navigation"
            className="border-t border-white/10 py-3 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-md px-3 py-3 text-sm font-medium transition hover:bg-white/5 hover:text-[var(--color-accent)] ${
                    isActive(item.href)
                      ? "bg-white/5 text-[var(--color-primary)]"
                      : "text-gray-300"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
