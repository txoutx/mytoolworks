import type { Metadata } from "next";
import { AdSlot, Footer, Header } from "./SiteChrome";
import { ToolCard } from "./ToolCard";
import { getToolsByCategory, groupToolsByLabel } from "../data/tools";
import type { Locale } from "../../lib/i18n";
import { localizeTool, ui, withLocalePath } from "../../lib/i18n";
import { getSeoLinksForCategory } from "../../lib/seo/internalLinks";
import { breadcrumbSchema } from "../../lib/seo/schema";
import { SeoCardGrid } from "./SeoPages";

type CategoryListingProps = {
  slug: string;
  title: string;
  description: string;
  locale?: Locale;
};

export function categoryMetadata(title: string, description: string, slug: string, locale: Locale = "es"): Metadata {
  const keywordMap: Record<string, string[]> = {
    pdf: locale === "en" ? ["pdf tools", "merge pdf", "compress pdf", "split pdf", "sign pdf"] : ["herramientas pdf", "unir pdf", "comprimir pdf", "dividir pdf", "firmar pdf"],
    img: locale === "en" ? ["image tools", "resize image", "compress image", "convert image"] : ["herramientas imagen", "editar imagen", "comprimir imagen", "convertir imagen"],
    audio: locale === "en" ? ["audio editor", "cut audio", "merge audio", "convert audio"] : ["editor de audio", "cortar audio", "unir audio", "convertir audio"],
    video: locale === "en" ? ["video editor", "cut video", "merge video", "video timeline"] : ["editor de video", "cortar video", "unir video", "timeline video"],
    conversor: locale === "en" ? ["online converters", "unit converter", "currency converter"] : ["conversores online", "conversor unidades", "conversor divisa"]
  };
  return {
    title,
    description,
    keywords: keywordMap[slug],
    alternates: {
      canonical: withLocalePath(`/${slug}`, locale),
      languages: {
        es: `/${slug}`,
        en: `/en/${slug}`
      }
    },
    openGraph: {
      title: `${title} online`,
      description,
      url: `https://mytoolworks.com${withLocalePath(`/${slug}`, locale)}`,
      type: "website"
    }
  };
}

export function CategoryListing({ slug, title, description, locale = "es" }: CategoryListingProps) {
  const t = ui[locale];
  const categoryTools = getToolsByCategory(slug).map((tool) => localizeTool(tool, locale));
  const grouped = groupToolsByLabel(categoryTools);
  const seoLinks = getSeoLinksForCategory(slug, locale);
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `https://mytoolworks.com${withLocalePath(`/${slug}`, locale)}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: categoryTools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool.title,
        url: `https://mytoolworks.com${tool.route}`
      }))
    }
  };
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: locale === "en" ? "Home" : "Inicio", href: withLocalePath("/", locale) },
    { name: title, href: withLocalePath(`/${slug}`, locale) }
  ]);

  return (
    <div className="site-shell">
      <Header locale={locale} />
      <main>
        <section className="hero compact-hero">
          <div className="container">
            <p className="eyebrow">{t.category}</p>
            <h1>{title}</h1>
            <p className="lead">{description}</p>
          </div>
        </section>

        <div className="container">
          <AdSlot locale={locale} />
        </div>

        <section className="section">
          <div className="container category-stack">
            {grouped.map((group) => (
              <section className="tool-group" key={group.title}>
                <div className="section-heading slim">
                  <h2>{group.title}</h2>
                </div>
                <div className="tool-grid compact-grid">
                  {group.tools.map((tool) => (
                    <ToolCard tool={tool} variant="showcase" locale={locale} key={tool.slug} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
        {seoLinks.length > 0 && (
          <section className="section seo-home-section">
            <div className="container">
              <div className="section-heading clean">
                <h2>{locale === "en" ? "Related guides" : "Guias relacionadas"}</h2>
              </div>
              <SeoCardGrid links={seoLinks} />
            </div>
          </section>
        )}
        <div className="container bottom-ad">
          <AdSlot label={t.lowerAd} locale={locale} />
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Footer locale={locale} />
    </div>
  );
}
