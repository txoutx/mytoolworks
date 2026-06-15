import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { CookieConsent } from "./components/CookieConsent";
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
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="d4c7dab5-5b5d-4327-98fc-047ac5f022ea"
          data-blockingmode="auto"
          strategy="beforeInteractive"
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4ZTWW5XPZ1"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-4ZTWW5XPZ1');`
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5516465526702669"
          crossOrigin="anonymous"
        ></script>
      </head>

      <body>
        {children}
        <CookieConsent locale={locale} />
      </body>
    </html>
  );
}
