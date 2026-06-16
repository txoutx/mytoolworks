import type { Metadata } from "next";
import { HomePageContent } from "../components/HomePageContent";

export const metadata: Metadata = {
  title: "MyToolWorks - Useful online tools",
  description: "Free online tools for PDF, images, audio, video and converters. Edit, convert and download files in your browser.",
  alternates: {
    canonical: "/en"
  },
  openGraph: {
    title: "MyToolWorks",
    description: "Free online tools for PDF, images, audio, video and converters. Edit, convert and download files in your browser.",
    url: "https://mytoolworks.com/en",
    type: "website"
  }
};

export default function EnglishHome() {
  return <HomePageContent locale="en" />;
}
