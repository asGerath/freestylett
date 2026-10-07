import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

// export const metadata: Metadata = {
//   title: "Freestyle Total",
//   description: "Eventos, ligas, rankings y freestylers del ecosistema freestyle.",
//   icons: {
//     icon: "/images/brand/logo-mark.webp",
//     apple: "/images/brand/logo-mark.webp",
//   },
//   openGraph: {
//     title: "Freestyle Total",
//     description:
//       "Eventos, ligas, rankings y freestylers del ecosistema freestyle.",
//     images: ["/images/brand/logo-primary.webp"],
//   },
// };


const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Freestyle Total",
    template: "%s | Freestyle Total",
  },

  description:
    "Eventos, ligas, rankings y freestylers del ecosistema freestyle.",

  icons: {
    icon: "/images/brand/logo-mark.webp",
    apple: "/images/brand/logo-mark.webp",
  },

  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Freestyle Total",
    title: "Freestyle Total",
    description:
      "Eventos, ligas, rankings y freestylers del ecosistema freestyle.",
    url: "/",
    images: [
      {
        url: "/images/brand/logo-primary.webp",
        alt: "Freestyle Total",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
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
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
