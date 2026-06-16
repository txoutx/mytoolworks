import type { Metadata } from "next";
import { ImagePageContent } from "../components/ImagePageContent";

export const metadata: Metadata = {
  title: "Imagen",
  description: "Edita, comprime, redimensiona, convierte, rota y descarga imagenes online desde el navegador.",
  keywords: ["herramientas imagen", "editar imagen online", "comprimir imagen", "convertir imagen", "redimensionar imagen"],
  alternates: {
    canonical: "/img",
    languages: {
      es: "/img",
      en: "/en/img"
    }
  },
  openGraph: {
    title: "Imagen",
    description: "Edita, comprime, redimensiona, convierte, rota y descarga imagenes online desde el navegador.",
    url: "https://mytoolworks.com/img",
    type: "website"
  }
};

export default function ImagePage() {
  return <ImagePageContent locale="es" />;
}
