import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot, Footer, Header } from "../../components/SiteChrome";
import { ToolCard } from "../../components/ToolCard";
import { ToolRunner } from "../../components/ToolRunner";
import { categories, getCategory, getRelatedTools, getTool, tools } from "../../data/tools";

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
  const tool = getTool(categorySlug, toolSlug);

  if (!tool) return {};

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

export default async function ToolPage({ params }: PageProps) {
  const { categorySlug, toolSlug } = await params;
  const tool = getTool(categorySlug, toolSlug);

  if (!tool) notFound();

  const category = getCategory(tool.categorySlug);
  const related = getRelatedTools(tool);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.h1,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    url: `https://mytoolworks.com${tool.route}`,
    description: tool.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR"
    }
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://mytoolworks.com"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category?.title ?? tool.categorySlug,
        item: `https://mytoolworks.com/${tool.categorySlug}`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.title,
        item: `https://mytoolworks.com${tool.route}`
      }
    ]
  };

  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="hero compact-hero">
          <div className="container">
            <p className="eyebrow">{category?.shortTitle ?? tool.categorySlug}</p>
            <h1>{tool.h1}</h1>
            <p className="lead">{tool.description}</p>
          </div>
        </section>
        <div className="container two-column">
          <article>
            <ToolRunner tool={tool} />
            <AdSlot label="Anuncio" />
            <div className="article">
              <h2>Como usar {tool.title}</h2>
              <p>
                Sube o introduce la informacion necesaria, ajusta las opciones principales y genera
                el resultado. La pagina esta preparada para procesar la herramienta segun su tipo:
                cliente, servidor o IA.
              </p>
              <h2>Procesamiento</h2>
              <ul>
                <li>Modo: {tool.processing === "client" ? "en el navegador" : "requiere backend especializado"}.</li>
                <li>Entrada: {tool.input}.</li>
                <li>Salida: {tool.output}.</li>
              </ul>
              <h2>Privacidad</h2>
              <p>
                Para herramientas con archivos, la arquitectura prevista usa almacenamiento temporal,
                colas de procesamiento y limpieza automatica tras generar la descarga.
              </p>
            </div>
          </article>
          <aside className="sidebar">
            <AdSlot label="Anuncio lateral" />
            <div className="related-list">
              <h2>Relacionadas</h2>
              {related.map((item) => (
                <a href={item.route} key={item.route}>
                  {item.title}
                </a>
              ))}
            </div>
          </aside>
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Footer />
    </div>
  );
}
