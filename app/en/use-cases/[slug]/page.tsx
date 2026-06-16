import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UseCasePageView } from "../../../components/SeoPages";
import { getUseCase, getUseCases } from "../../../../lib/seo/useCases";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getUseCases("en").map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getUseCase("en", slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: `/en/use-cases/${page.slug}`,
      languages: {
        es: page.alternateSlug ? `/casos/${page.alternateSlug}` : "/casos",
        en: `/en/use-cases/${page.slug}`
      }
    },
    openGraph: {
      title: page.h1,
      description: page.description,
      url: `https://mytoolworks.com/en/use-cases/${page.slug}`,
      type: "article",
      images: ["/favicon-192x192.png"]
    }
  };
}

export default async function EnglishUseCaseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getUseCase("en", slug);
  if (!page) notFound();
  return <UseCasePageView page={page} />;
}
