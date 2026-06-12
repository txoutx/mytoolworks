import { CategoryListing, categoryMetadata } from "../../components/CategoryListing";

const description = "All PDF tools grouped to convert, edit, organize and sign documents.";

export const metadata = categoryMetadata("PDF Tools", description, "pdf", "en");

export default function EnglishPdfPage() {
  return <CategoryListing slug="pdf" title="PDF Tools" description={description} locale="en" />;
}
