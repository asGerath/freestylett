import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Freestyle Total",
  description: "Eventos, ligas, rankings y freestylers del ecosistema freestyle.",
  icons: {
    icon: "/images/brand/logo-mark.webp",
    apple: "/images/brand/logo-mark.webp",
  },
  openGraph: {
    title: "Freestyle Total",
    description:
      "Eventos, ligas, rankings y freestylers del ecosistema freestyle.",
    images: ["/images/brand/logo-primary.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {/* Navbar global disponible en todas las páginas */}
        <Navbar />

        {/* Contenido de cada página */}
        {children}
      </body>
    </html>
  );
}
