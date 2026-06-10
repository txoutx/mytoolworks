import { CategoryListing, categoryMetadata } from "../components/CategoryListing";

const description = "Todas las herramientas PDF agrupadas para convertir, editar, organizar y proteger documentos.";

export const metadata = categoryMetadata("Herramientas PDF", description, "pdf");

export default function PdfPage() {
  return <CategoryListing slug="pdf" title="Herramientas PDF" description={description} />;
}
