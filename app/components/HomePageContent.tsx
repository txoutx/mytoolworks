import Link from "next/link";
import { ArrowLeftRight, FileImage, FileText, Film, Music2 } from "lucide-react";
import type { Locale } from "../../lib/i18n";
import { ui, withLocalePath } from "../../lib/i18n";
import { getArticles } from "../../lib/seo/blog";
import { getUseCases } from "../../lib/seo/useCases";
import { AdSlot, Footer, Header } from "./SiteChrome";
import { SeoCardGrid } from "./SeoPages";

export function HomePageContent({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const articleLinks = getArticles(locale).slice(0, 3).map((article) => ({
    title: article.title,
    href: withLocalePath(`/blog/${article.slug}`, locale),
    description: article.description
  }));
  const caseLinks = getUseCases(locale).slice(0, 3).map((page) => ({
    title: page.title,
    href: locale === "en" ? `/en/use-cases/${page.slug}` : `/casos/${page.slug}`,
    description: page.description
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MyToolWorks",
    url: "https://mytoolworks.com/",
    description: t.homeLead,
    publisher: {
      "@type": "Organization",
      name: "MyToolWorks",
      url: "https://mytoolworks.com/",
      logo: "https://mytoolworks.com/favicon-192x192.png"
    }
  };
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MyToolWorks",
    url: "https://mytoolworks.com/",
    logo: "https://mytoolworks.com/favicon-192x192.png"
  };
  return (
    <div className="site-shell">
      <Header locale={locale} />
      <main>
        <section className="hero compact-hero">
          <div className="container">
            <p className="eyebrow">{t.homeEyebrow}</p>
            <h1>MyToolWorks</h1>
            <p className="lead">{t.homeLead}</p>
          </div>
        </section>

        <div className="container">
          <AdSlot locale={locale} />
        </div>

        <section className="home-category-section">
          <div className="container">
            <div className="home-category-grid">
              <Link href={withLocalePath("/pdf", locale)} className="home-category-card">
                <div className="home-category-icon" aria-hidden="true">
                  <FileText size={28} />
                </div>
                <h2>PDF</h2>
                <p>{t.homePdfDescription}</p>
                <div className="category-preview-list">
                  <span>{locale === "en" ? "Merge PDF" : "Unir PDF"}</span>
                  <span>{locale === "en" ? "Compress" : "Comprimir"}</span>
                  <span>{locale === "en" ? "Sign" : "Firmar"}</span>
                </div>
                <footer>{t.openPdf}</footer>
              </Link>

              <Link href={withLocalePath("/img", locale)} className="home-category-card">
                <div className="home-category-icon" aria-hidden="true">
                  <FileImage size={28} />
                </div>
                <h2>{t.homeImageTitle}</h2>
                <p>{t.homeImageDescription}</p>
                <div className="category-preview-list">
                  <span>{locale === "en" ? "Resize" : "Redimensionar"}</span>
                  <span>WebP/JPG/PNG</span>
                  <span>{locale === "en" ? "Watermark" : "Marca de agua"}</span>
                </div>
                <footer>{t.openImage}</footer>
              </Link>

              <Link href={withLocalePath("/audio", locale)} className="home-category-card">
                <div className="home-category-icon" aria-hidden="true">
                  <Music2 size={28} />
                </div>
                <h2>{t.homeAudioTitle}</h2>
                <p>{t.homeAudioDescription}</p>
                <div className="category-preview-list">
                  <span>{locale === "en" ? "Cut" : "Cortar"}</span>
                  <span>{locale === "en" ? "Merge" : "Unir"}</span>
                  <span>{locale === "en" ? "Enhance" : "Mejorar"}</span>
                </div>
                <footer>{t.openAudio}</footer>
              </Link>

              <Link href={withLocalePath("/video", locale)} className="home-category-card">
                <div className="home-category-icon" aria-hidden="true">
                  <Film size={28} />
                </div>
                <h2>{t.homeVideoTitle}</h2>
                <p>{t.homeVideoDescription}</p>
                <div className="category-preview-list">
                  <span>{locale === "en" ? "Cut" : "Cortar"}</span>
                  <span>{locale === "en" ? "Merge" : "Unir"}</span>
                  <span>Crop</span>
                </div>
                <footer>{t.openVideo}</footer>
              </Link>

              <Link href={withLocalePath("/conversor", locale)} className="home-category-card">
                <div className="home-category-icon" aria-hidden="true">
                  <ArrowLeftRight size={28} />
                </div>
                <h2>{t.homeConverterTitle}</h2>
                <p>{t.homeConverterDescription}</p>
                <div className="category-preview-list">
                  <span>{locale === "en" ? "Currency" : "Divisa"}</span>
                  <span>{locale === "en" ? "Length" : "Longitud"}</span>
                  <span>{locale === "en" ? "Temperature" : "Temperatura"}</span>
                </div>
                <footer>{t.openConverter}</footer>
              </Link>
            </div>
          </div>
        </section>

        <section className="section seo-home-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{locale === "en" ? "Guides" : "Guias"}</p>
                <h2>{locale === "en" ? "Useful workflows" : "Flujos utiles"}</h2>
              </div>
              <p>
                {locale === "en"
                  ? "How-to guides and search-focused use cases connected to each tool."
                  : "Guias y casos de uso conectados con cada herramienta para resolver busquedas concretas."}
              </p>
            </div>
            <SeoCardGrid links={[...articleLinks, ...caseLinks]} />
          </div>
        </section>

        <div className="container bottom-ad">
          <AdSlot label={t.lowerAd} locale={locale} />
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <Footer locale={locale} />
    </div>
  );
}
