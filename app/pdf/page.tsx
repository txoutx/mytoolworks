import { CategoryListing, categoryMetadata } from "../components/CategoryListing";

const description = "Herramientas PDF online para unir, dividir, comprimir, rotar, ordenar, convertir a imagen y firmar documentos.";

export const metadata = categoryMetadata("PDF", description, "pdf");

export default function PdfPage() {
  return <CategoryListing slug="pdf" title="PDF" description={description} locale="es" />;
}
