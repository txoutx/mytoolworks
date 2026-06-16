import type { Metadata } from "next";
import { UseCaseIndexPage } from "../../components/SeoPages";
import { getUseCases } from "../../../lib/seo/useCases";

export const metadata: Metadata = {
  title: "Use cases",
  description: "Practical workflows for specific jobs with MyToolWorks online tools.",
  keywords: ["online tools use cases", "compress video whatsapp", "merge pdf work"],
  alternates: {
    canonical: "/en/use-cases",
    languages: {
      es: "/casos",
      en: "/en/use-cases"
    }
  },
  openGraph: {
    title: "MyToolWorks use cases",
    description: "Practical workflows for online tools.",
    url: "https://mytoolworks.com/en/use-cases",
    type: "website",
    images: ["/favicon-192x192.png"]
  }
};

export default function EnglishUseCasesPage() {
  return <UseCaseIndexPage locale="en" pages={getUseCases("en")} />;
}
