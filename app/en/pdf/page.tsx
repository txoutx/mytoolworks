import { categoryMetadata } from "../../components/CategoryListing";
import { PdfListing } from "../../pdf/page";

const description = "All PDF tools grouped to convert, edit, organize and sign documents.";

export const metadata = categoryMetadata("PDF Tools", description, "pdf", "en");

export default function EnglishPdfPage() {
  return <PdfListing locale="en" />;
}
