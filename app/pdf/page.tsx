import { CategoryListing, categoryMetadata } from "../components/CategoryListing";
import type { Locale } from "../../lib/i18n";

const description = "Todas las herramientas PDF agrupadas para convertir, editar, organizar y proteger documentos.";

export const metadata = categoryMetadata("Herramientas PDF", description, "pdf");

export default function PdfPage() {
  return <PdfListing locale="es" />;
}

export function PdfListing({ locale }: { locale: Locale }) {
  if (locale === "en") {
    return <CategoryListing slug="pdf" title="PDF Tools" description="All PDF tools grouped to convert, edit, organize and sign documents." locale="en" />;
  }
  return <CategoryListing slug="pdf" title="Herramientas PDF" description={description} locale="es" />;
}
