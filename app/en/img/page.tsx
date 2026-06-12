import type { Metadata } from "next";
import { ImagePageContent } from "../../components/ImagePageContent";

export const metadata: Metadata = {
  title: "Online image tools",
  description: "Edit, compress, resize, convert, rotate and download images online from your browser.",
  alternates: {
    canonical: "/en/img"
  },
  openGraph: {
    title: "Online image tools",
    description: "Edit, compress, resize, convert, rotate and download images online from your browser.",
    url: "https://mytoolworks.com/en/img",
    type: "website"
  }
};

export default function EnglishImagePage() {
  return <ImagePageContent locale="en" />;
}
