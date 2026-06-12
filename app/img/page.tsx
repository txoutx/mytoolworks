import type { Metadata } from "next";
import { ImagePageContent } from "../components/ImagePageContent";

export const metadata: Metadata = {
  title: "Herramientas de imagen online",
  description: "Edita, comprime, redimensiona, convierte, rota y descarga imagenes online desde el navegador.",
  alternates: {
    canonical: "/img"
  },
  openGraph: {
    title: "Herramientas de imagen online",
    description: "Edita, comprime, redimensiona, convierte, rota y descarga imagenes online desde el navegador.",
    url: "https://mytoolworks.com/img",
    type: "website"
  }
};

export default function ImagePage() {
  return <ImagePageContent locale="es" />;
}
