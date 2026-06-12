import type { Metadata } from "next";
import { AdSlot, Footer, Header } from "./SiteChrome";
import { ToolCard } from "./ToolCard";
import { getToolsByCategory, groupToolsByLabel } from "../data/tools";
import type { Locale } from "../../lib/i18n";
import { localizeTool, ui, withLocalePath } from "../../lib/i18n";

type CategoryListingProps = {
  slug: string;
  title: string;
  description: string;
  locale?: Locale;
};

export function categoryMetadata(title: string, description: string, slug: string, locale: Locale = "es"): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: withLocalePath(`/${slug}`, locale)
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
        <div className="container bottom-ad">
          <AdSlot label={t.lowerAd} locale={locale} />
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
