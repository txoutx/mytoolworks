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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WQC23GXG');`
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5516465526702669"
          crossOrigin="anonymous"
        ></script>
      </head>

      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WQC23GXG"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
