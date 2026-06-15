import type { Metadata } from "next";
import { headers } from "next/headers";
import { CookieConsent } from "./components/CookieConsent";
import { ThirdPartyScripts } from "./components/ThirdPartyScripts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mytoolworks.com"),
  title: {
    default: "MyToolWorks - Herramientas online utiles",
    template: "%s | MyToolWorks"
  },
  description:
    "Herramientas online rapidas para PDF, calculadoras, conversores, textos, CV y documentos.",
  applicationName: "MyToolWorks",
  icons: {
    icon: [
      { url: "/favicon-mtw-2026.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "MyToolWorks",
    description:
      "Herramientas online rapidas para PDF, calculadoras, conversores, textos, CV y documentos.",
    url: "https://mytoolworks.com",
    siteName: "MyToolWorks",
    locale: "es_ES",
    type: "website"
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
        <CookieConsent locale={locale} />
        <ThirdPartyScripts />
      </body>
    </html>
  );
}
