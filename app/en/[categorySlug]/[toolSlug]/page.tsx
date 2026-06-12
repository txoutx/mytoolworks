import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTool, tools } from "../../../data/tools";
import { localizeTool } from "../../../../lib/i18n";
import { ToolPageContent } from "../../../[categorySlug]/[toolSlug]/page";

type PageProps = {
  params: Promise<{ categorySlug: string; toolSlug: string }>;
};

export function generateStaticParams() {
  return tools.map((tool) => ({
    categorySlug: tool.categorySlug,
    toolSlug: tool.slug
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug, toolSlug } = await params;
  const sourceTool = getTool(categorySlug, toolSlug);
  if (!sourceTool) return {};
  const tool = localizeTool(sourceTool, "en");

  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: tool.route
    },
    openGraph: {
      title: tool.h1,
      description: tool.description,
      url: `https://mytoolworks.com${tool.route}`,
      type: "website"
    }
  };
}

export default async function EnglishToolPage({ params }: PageProps) {
  const { categorySlug, toolSlug } = await params;
  const tool = getTool(categorySlug, toolSlug);
  if (!tool) notFound();

  return <ToolPageContent tool={tool} locale="en" />;
}
