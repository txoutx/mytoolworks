import type { Metadata } from "next";
import { ImagePageContent } from "../../components/ImagePageContent";

export const metadata: Metadata = {
  title: "Images",
  description: "Edit, compress, resize, convert, rotate and download images online from your browser.",
  keywords: ["image tools", "edit image online", "compress image", "convert image", "resize image"],
  alternates: {
    canonical: "/en/img",
    languages: {
      es: "/img",
      en: "/en/img"
    }
  },
  openGraph: {
    title: "Images",
    description: "Edit, compress, resize, convert, rotate and download images online from your browser.",
    url: "https://mytoolworks.com/en/img",
    type: "website",
    images: ["/favicon-192x192.png"]
  }
};

export default function EnglishImagePage() {
  return <ImagePageContent locale="en" />;
}
