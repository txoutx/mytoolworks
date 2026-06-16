import type { Metadata } from "next";
import { BlogIndexPage } from "../../components/SeoPages";
import { getArticles } from "../../../lib/seo/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Practical MyToolWorks guides for PDF, image, audio, video and online converters.",
  keywords: ["online tools blog", "pdf guides", "video guides", "online converters"],
  alternates: {
    canonical: "/en/blog",
    languages: {
      es: "/blog",
      en: "/en/blog"
    }
  },
  openGraph: {
    title: "MyToolWorks Blog",
    description: "Practical guides for online tools.",
    url: "https://mytoolworks.com/en/blog",
    type: "website",
    images: ["/favicon-192x192.png"]
  }
};

export default function EnglishBlogPage() {
  return <BlogIndexPage locale="en" articles={getArticles("en")} />;
}
