import Link from "next/link";
import { ArrowLeftRight, FileImage, FileText } from "lucide-react";
import { AdSlot, Footer, Header } from "./components/SiteChrome";
import type { Locale } from "../lib/i18n";
import { ui, withLocalePath } from "../lib/i18n";

export default function Home() {
  return <HomePage locale="es" />;
}

export function HomePage({ locale }: { locale: Locale }) {
  const t = ui[locale];
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
                <h2>PDF Tools</h2>
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

        <div className="container bottom-ad">
          <AdSlot label={t.lowerAd} locale={locale} />
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
