import type { Metadata } from "next";
import { headers } from "next/headers";
import { ThirdPartyScripts } from "./components/ThirdPartyScripts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mytoolworks.com"),
  title: {
    default: "MyToolWorks - Herramientas online utiles",
    template: "%s | MyToolWorks"
  },
  description:
    "Herramientas online gratis para PDF, imagen, audio, video y conversores. Edita, convierte y descarga archivos desde el navegador.",
  applicationName: "MyToolWorks",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  alternates: {
    canonical: "/",
    languages: {
      es: "/",
      en: "/en"
    }
  },
  openGraph: {
    title: "MyToolWorks - Herramientas online utiles",
    description:
      "Herramientas online gratis para PDF, imagen, audio, video y conversores. Edita, convierte y descarga archivos desde el navegador.",
    url: "https://mytoolworks.com",
    siteName: "MyToolWorks",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/favicon-192x192.png",
        width: 192,
        height: 192,
        alt: "MyToolWorks"
      }
    ]
  },
  twitter: {
    card: "summary",
    title: "MyToolWorks - Herramientas online utiles",
    description:
      "Herramientas online gratis para PDF, imagen, audio, video y conversores. Edita, convierte y descarga archivos desde el navegador.",
    images: ["/favicon-192x192.png"]
  }
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await headers()).get("x-locale") === "en" ? "en" : "es";
  return (
    <html lang={locale}>
      <head>
      </head>

      <body>
        {children}
        <ThirdPartyScripts />
      </body>
    </html>
  );
}
