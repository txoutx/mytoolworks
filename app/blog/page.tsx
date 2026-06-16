import type { Metadata } from "next";
import { BlogIndexPage } from "../components/SeoPages";
import { getArticles } from "../../lib/seo/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guias practicas de MyToolWorks para PDF, imagen, audio, video y conversores online.",
  keywords: ["blog herramientas online", "guias pdf", "guias video", "conversores online"],
  alternates: {
    canonical: "/blog",
    languages: {
      es: "/blog",
      en: "/en/blog"
    }
  },
  openGraph: {
    title: "Blog de MyToolWorks",
    description: "Guias practicas para usar herramientas online.",
    url: "https://mytoolworks.com/blog",
    type: "website",
    images: ["/favicon-192x192.png"]
  }
};

export default function BlogPage() {
  return <BlogIndexPage locale="es" articles={getArticles("es")} />;
}
