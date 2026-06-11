import type { Metadata } from "next";
import Script from "next/script";
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
    icon: "/icono.png",
    apple: "/icono.png"
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

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5516465526702669"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
