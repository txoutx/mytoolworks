import type { Metadata } from "next";
import { HomePageContent } from "../components/HomePageContent";

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
  return <HomePageContent locale="en" />;
}
