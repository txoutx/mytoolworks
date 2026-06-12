import type { Metadata } from "next";
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
      <head>
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

      <body>{children}</body>
    </html>
  );
}
