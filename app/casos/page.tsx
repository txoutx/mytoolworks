import type { Metadata } from "next";
import { UseCaseIndexPage } from "../components/SeoPages";
import { getUseCases } from "../../lib/seo/useCases";

export const metadata: Metadata = {
  title: "Casos de uso",
  description: "Flujos practicos para resolver tareas concretas con herramientas online de MyToolWorks.",
  keywords: ["casos de uso herramientas online", "comprimir video whatsapp", "unir pdf trabajo"],
  alternates: {
    canonical: "/casos",
    languages: {
      es: "/casos",
      en: "/en/use-cases"
    }
  },
  openGraph: {
    title: "Casos de uso de MyToolWorks",
    description: "Flujos practicos para herramientas online.",
    url: "https://mytoolworks.com/casos",
    type: "website",
    images: ["/favicon-192x192.png"]
  }
};

export default function CasesPage() {
  return <UseCaseIndexPage locale="es" pages={getUseCases("es")} />;
}
