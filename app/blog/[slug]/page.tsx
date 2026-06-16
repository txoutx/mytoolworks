import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "../../components/SeoPages";
import { getArticle, getArticles } from "../../../lib/seo/blog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getArticles("es").map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("es", slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: {
      canonical: `/blog/${article.slug}`,
      languages: {
        es: `/blog/${article.slug}`,
        en: article.alternateSlug ? `/en/blog/${article.alternateSlug}` : "/en/blog"
      }
    },
    openGraph: {
      title: article.h1,
      description: article.description,
      url: `https://mytoolworks.com/blog/${article.slug}`,
      type: "article",
      images: ["/favicon-192x192.png"]
    }
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle("es", slug);
  if (!article) notFound();
  return <ArticlePage article={article} />;
}
