import type { Locale } from "../../lib/i18n";
import { ui, withLocalePath } from "../../lib/i18n";
import { breadcrumbSchema, faqSchema } from "../../lib/seo/schema";
import { ImageTool } from "../img/ImageTool";
import { AdSlot, Footer, Header } from "./SiteChrome";

export function ImagePageContent({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const seo =
    locale === "en"
      ? {
          canDo: "What you can do",
          canDoText:
            "You can change the final canvas, add multiple images to create a collage, move them around, scale them, convert them to JPG, PNG, WebP or AVIF, reduce file size, rotate, flip and add a text watermark.",
          advantages: "Why work in the browser",
          advantagesText:
            "Images are processed locally with canvas. They are not uploaded to a server, so basic edits stay fast and private.",
          formats: "Supported formats",
          formatsText: "The tool accepts JPG, PNG, WebP and AVIF when your browser supports them.",
          faq: "Frequently asked questions",
          q1: "Are my images uploaded to a server?",
          a1: "No, processing runs locally in your browser.",
          q2: "Which formats can I use?",
          a2: "You can work with JPG, PNG, WebP and other formats supported by your browser.",
          q3: "Can I reduce image file size?",
          a3: "Yes, you can adjust quality and export a compressed image.",
          q4: "Can I resize an image?",
          a4: "Yes, you can change width, height or scale by percentage."
        }
      : {
          canDo: "Que puedes hacer",
          canDoText:
            "Puedes cambiar el lienzo final, anadir varias imagenes para crear un collage, moverlas dentro, escalarlas, convertirlas a JPG, PNG, WebP o AVIF, reducir su peso, rotarlas, voltearlas y anadir una marca de agua de texto.",
          advantages: "Ventajas de trabajar en el navegador",
          advantagesText:
            "La imagen se procesa localmente con canvas. No se sube a un servidor, por lo que el flujo es rapido y privado para ediciones basicas.",
          formats: "Formatos compatibles",
          formatsText: "La herramienta acepta JPG, PNG, WebP y AVIF si tu navegador lo soporta.",
          faq: "Preguntas frecuentes",
          q1: "Mis imagenes se suben a un servidor?",
          a1: "No, el procesamiento se realiza localmente en tu navegador.",
          q2: "Que formatos puedo usar?",
          a2: "Puedes trabajar con JPG, PNG, WebP y otros formatos compatibles con tu navegador.",
          q3: "Puedo reducir el peso de una imagen?",
          a3: "Si, puedes ajustar la calidad y exportar la imagen comprimida.",
          q4: "Puedo cambiar el tamano de una imagen?",
          a4: "Si, puedes modificar ancho, alto o escalar por porcentaje."
        };
  const faqItems = [
    { question: seo.q1, answer: seo.a1 },
    { question: seo.q2, answer: seo.a2 },
    { question: seo.q3, answer: seo.a3 },
    { question: seo.q4, answer: seo.a4 }
  ];
  const schemas = [
    faqSchema(faqItems),
    breadcrumbSchema([
      { name: locale === "en" ? "Home" : "Inicio", href: withLocalePath("/", locale) },
      { name: t.imageTitle, href: withLocalePath("/img", locale) }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: t.imageTitle,
      description: t.imageLead,
      url: `https://mytoolworks.com${withLocalePath("/img", locale)}`
    }
  ].filter(Boolean);
  return (
    <div className="site-shell">
      <Header locale={locale} />
      <main>
        <section className="hero compact-hero">
          <div className="container">
            <p className="eyebrow">{t.imageEyebrow}</p>
            <h1>{t.imageTitle}</h1>
            <p className="lead">{t.imageLead}</p>
          </div>
        </section>

        <div className="container">
          <AdSlot label={t.topAd} locale={locale} />
        </div>

        <section className="section">
          <div className="container">
            <ImageTool locale={locale} />
          </div>
        </section>

        <div className="container bottom-ad">
          <AdSlot label={t.lowerAd} locale={locale} />
        </div>

        <section className="section">
          <div className="container">
            <div className="article tool-seo-content">
              <h2>{seo.canDo}</h2>
              <p>{seo.canDoText}</p>
              <h2>{seo.advantages}</h2>
              <p>{seo.advantagesText}</p>
              <h2>{seo.formats}</h2>
              <p>{seo.formatsText}</p>
              <h2>{seo.faq}</h2>
              <div className="faq-list">
                <section className="faq-item">
                  <h3>{seo.q1}</h3>
                  <p>{seo.a1}</p>
                </section>
                <section className="faq-item">
                  <h3>{seo.q2}</h3>
                  <p>{seo.a2}</p>
                </section>
                <section className="faq-item">
                  <h3>{seo.q3}</h3>
                  <p>{seo.a3}</p>
                </section>
                <section className="faq-item">
                  <h3>{seo.q4}</h3>
                  <p>{seo.a4}</p>
                </section>
              </div>
            </div>
          </div>
        </section>

      </main>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <Footer locale={locale} />
    </div>
  );
}
