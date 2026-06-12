import type { Metadata } from "next";
import { HomePage } from "../page";

export const metadata: Metadata = {
  title: "MyToolWorks - Useful online tools",
  description: "Fast online tools for PDF files, images and documents.",
  alternates: {
    canonical: "/en"
  },
  openGraph: {
    title: "MyToolWorks",
    description: "Fast online tools for PDF files, images and documents.",
    url: "https://mytoolworks.com/en",
    type: "website"
  }
};

export default function EnglishHome() {
  return <HomePage locale="en" />;
}
