import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UseCasePageView } from "../../components/SeoPages";
import { getUseCase, getUseCases } from "../../../lib/seo/useCases";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getUseCases("es").map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getUseCase("es", slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: `/casos/${page.slug}`,
      languages: {
        es: `/casos/${page.slug}`,
        en: page.alternateSlug ? `/en/use-cases/${page.alternateSlug}` : "/en/use-cases"
      }
    },
    openGraph: {
      title: page.h1,
      description: page.description,
      url: `https://mytoolworks.com/casos/${page.slug}`,
      type: "article",
      images: ["/favicon-192x192.png"]
    }
  };
}

export default async function UseCaseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getUseCase("es", slug);
  if (!page) notFound();
  return <UseCasePageView page={page} />;
}
