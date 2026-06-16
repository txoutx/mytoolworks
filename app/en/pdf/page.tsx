import { CategoryListing, categoryMetadata } from "../../components/CategoryListing";

const description = "Online PDF tools to merge, split, compress, rotate, reorder, convert to images and sign documents.";

export const metadata = categoryMetadata("PDF", description, "pdf", "en");

export default function EnglishPdfPage() {
  return <CategoryListing slug="pdf" title="PDF" description={description} locale="en" />;
}
