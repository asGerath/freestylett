"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";

const navItems = [
  { label: "Eventos", href: "/eventos" },
  { label: "Freestylers", href: "/freestylers" },
  { label: "Ligas", href: "/ligas" },
  { label: "Blog", href: "/blog" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateNavbar = () => setIsScrolled(window.scrollY > 16);

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });

    return () => window.removeEventListener("scroll", updateNavbar);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        isScrolled
          ? "border-b border-[var(--color-border)] bg-[#e5ecef]/95 shadow-[0_10px_30px_rgba(11,24,32,0.08)] backdrop-blur-xl"
          : "border-b border-transparent bg-[var(--color-bg)]"
      }`}
    >
      <Container>
        <nav
          className="flex h-20 items-center justify-between"
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
              className="h-11 w-auto sm:h-12"
            />
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/70 p-1.5 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${isActive(item.href)
                    ? "bg-[var(--color-primary-bright)] text-[var(--color-text-dark)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]"
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
            className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/70 text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] md:hidden"
          >
            <span aria-hidden="true" className="text-2xl leading-none">
              {isOpen ? "×" : "☰"}
            </span>
          </button>
        </nav>

        {isOpen && (
          <div
            id="mobile-navigation"
            className="border-t border-[var(--color-border)] py-3 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive(item.href)
                      ? "bg-[var(--color-primary-bright)] text-[var(--color-text-dark)]"
                      : "text-[var(--color-muted)] hover:bg-white/80 hover:text-[var(--color-text)]"
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
