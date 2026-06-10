import type { Metadata } from "next";
import { AdSlot, Footer, Header } from "./SiteChrome";
import { ToolCard } from "./ToolCard";
import { getToolsByCategory, groupToolsByLabel } from "../data/tools";

type CategoryListingProps = {
  slug: string;
  title: string;
  description: string;
};

export function categoryMetadata(title: string, description: string, slug: string): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `/${slug}`
    },
    openGraph: {
      title: `${title} online`,
      description,
      url: `https://mytoolworks.com/${slug}`,
      type: "website"
    }
  };
}

export function CategoryListing({ slug, title, description }: CategoryListingProps) {
  const categoryTools = getToolsByCategory(slug);
  const grouped = groupToolsByLabel(categoryTools);

  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="hero compact-hero">
          <div className="container">
            <p className="eyebrow">Categoria</p>
            <h1>{title}</h1>
            <p className="lead">{description}</p>
          </div>
        </section>

        <div className="container">
          <AdSlot />
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
                    <ToolCard tool={tool} compact key={tool.slug} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
