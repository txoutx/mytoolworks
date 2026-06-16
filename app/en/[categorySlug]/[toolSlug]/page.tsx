import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot, Footer, Header } from "../../../components/SiteChrome";
import { ToolRunner } from "../../../components/ToolRunner";
import { getCategory, getRelatedTools, getTool, tools } from "../../../data/tools";
import { localizeCategory, localizeTool, ui, withLocalePath } from "../../../../lib/i18n";
import { getSeoLinksForTool } from "../../../../lib/seo/internalLinks";
import { faqSchema } from "../../../../lib/seo/schema";

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
      canonical: tool.route,
      languages: {
        es: sourceTool.route,
        en: tool.route
      }
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

  const localizedTool = localizeTool(tool, "en");
  const sourceCategory = getCategory(tool.categorySlug);
  const category = sourceCategory ? localizeCategory(sourceCategory, "en") : undefined;
  const related = getRelatedTools(tool).map((item) => localizeTool(item, "en"));
  const seoLinks = getSeoLinksForTool(tool.slug, "en");
  const t = ui.en;
  const faqs = [
    {
      question: `Can I use ${localizedTool.title} for free?`,
      answer: "Yes, the tool is designed for free online use in the browser."
    },
    {
      question: "Does it work on mobile?",
      answer: "Yes, the interface is responsive and works on mobile, tablet and desktop."
    }
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: localizedTool.h1,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    url: `https://mytoolworks.com${localizedTool.route}`,
    description: localizedTool.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR"
    }
  };
  const faqJsonLd = faqSchema(faqs);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `https://mytoolworks.com${withLocalePath("/", "en")}`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category?.title ?? localizedTool.categorySlug,
        item: `https://mytoolworks.com${withLocalePath(`/${localizedTool.categorySlug}`, "en")}`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: localizedTool.title,
        item: `https://mytoolworks.com${localizedTool.route}`
      }
    ]
  };

  return (
    <div className="site-shell">
      <Header locale="en" />
      <main>
        <section className="hero compact-hero">
          <div className="container">
            <p className="eyebrow">{category?.shortTitle ?? localizedTool.categorySlug}</p>
            <h1>{localizedTool.h1}</h1>
            <p className="lead">{localizedTool.description}</p>
          </div>
        </section>
        <div className="container tool-top-ad">
          <AdSlot label={t.topAd} locale="en" />
        </div>
        <div className="container two-column">
          <article>
            <ToolRunner tool={localizedTool} locale="en" />
            <div className="tool-result-ad">
              <AdSlot label={t.resultAd} locale="en" />
            </div>
            <div className="article tool-seo-content">
              <h2>{localizedTool.title} free online</h2>
              <p>{localizedTool.description} This page is designed for fast browser-based work with a clean interface.</p>
              <h2>How to use {localizedTool.title}</h2>
              <ol>
                <li>Enter the value or upload the file required by the tool.</li>
                <li>Review the preview and adjust the available options.</li>
                <li>Run the tool.</li>
                <li>Download or copy the result when it is ready.</li>
              </ol>
            </div>
          </article>
          <aside className="sidebar">
            <AdSlot label={t.sideAd} locale="en" />
            <div className="related-list">
              <h2>{t.related}</h2>
              {related.map((item) => (
                <a href={item.route} key={item.route}>
                  {item.title}
                </a>
              ))}
            </div>
            {seoLinks.articles.length > 0 && (
              <div className="related-list">
                <h2>Guides</h2>
                {seoLinks.articles.map((item) => (
                  <a href={item.href} key={item.href}>
                    {item.title}
                  </a>
                ))}
              </div>
            )}
            {seoLinks.cases.length > 0 && (
              <div className="related-list">
                <h2>Use cases</h2>
                {seoLinks.cases.map((item) => (
                  <a href={item.href} key={item.href}>
                    {item.title}
                  </a>
                ))}
              </div>
            )}
          </aside>
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <Footer locale="en" />
    </div>
  );
}
