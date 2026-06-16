import Link from "next/link";
import { AdSlot, Footer, Header } from "./SiteChrome";
import type { Locale } from "../../lib/i18n";
import { withLocalePath } from "../../lib/i18n";
import type { RelatedLink, SeoArticle, UseCasePage } from "../../lib/seo/types";
import { getToolLinks, toolPathFromSlug } from "../../lib/seo/internalLinks";
import { articleSchema, breadcrumbSchema, faqSchema, useCaseSchema } from "../../lib/seo/schema";

export function SeoCardGrid({ links }: { links: RelatedLink[] }) {
  if (!links.length) return null;
  return (
    <div className="seo-card-grid">
      {links.map((link) => (
        <Link href={link.href} className="seo-card" key={link.href}>
          <h3>{link.title}</h3>
          {link.description && <p>{link.description}</p>}
        </Link>
      ))}
    </div>
  );
}

export function BlogIndexPage({ locale, articles }: { locale: Locale; articles: SeoArticle[] }) {
  return (
    <div className="site-shell">
      <Header locale={locale} />
      <main>
        <section className="hero compact-hero">
          <div className="container">
            <p className="eyebrow">{locale === "en" ? "Guides" : "Guias"}</p>
            <h1>{locale === "en" ? "MyToolWorks Blog" : "Blog de MyToolWorks"}</h1>
            <p className="lead">
              {locale === "en"
                ? "Practical guides for PDF, image, audio, video and converter workflows."
                : "Guias practicas para trabajar con PDF, imagen, audio, video y conversores online."}
            </p>
          </div>
        </section>
        <div className="container">
          <AdSlot locale={locale} />
        </div>
        <section className="section">
          <div className="container">
            <div className="seo-card-grid">
              {articles.map((article) => (
                <Link href={withLocalePath(`/blog/${article.slug}`, locale)} className="seo-card blog-card" key={article.slug}>
                  <ArticleVisual article={article} compact />
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </div>
  );
}

export function ArticlePage({ article }: { article: SeoArticle }) {
  const locale = article.locale;
  const path = withLocalePath(`/blog/${article.slug}`, locale);
  const toolLinks = getToolLinks(article.relatedTools, locale);
  const schemas = [
    articleSchema(article, path),
    faqSchema(article.faq),
    breadcrumbSchema([
      { name: locale === "en" ? "Home" : "Inicio", href: withLocalePath("/", locale) },
      { name: "Blog", href: withLocalePath("/blog", locale) },
      { name: article.title, href: path }
    ])
  ].filter(Boolean);

  return (
    <div className="site-shell">
      <Header locale={locale} />
      <main>
        <section className="hero compact-hero">
          <div className="container">
            <p className="eyebrow">Blog</p>
            <h1>{article.h1}</h1>
            <p className="lead">{article.description}</p>
          </div>
        </section>
        <div className="container">
          <AdSlot locale={locale} />
        </div>
        <section className="section">
          <div className="container two-column">
            <article className="article seo-article">
              <ArticleVisual article={article} />
              {article.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                  {section.bullets && (
                    <ul>
                      {section.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              <h2>{locale === "en" ? "Frequently asked questions" : "Preguntas frecuentes"}</h2>
              <div className="faq-list">
                {article.faq.map((item) => (
                  <section className="faq-item" key={item.question}>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </section>
                ))}
              </div>
            </article>
            <aside className="sidebar">
              <AdSlot locale={locale} />
              <div className="related-list">
                <h2>{locale === "en" ? "Recommended tools" : "Herramientas recomendadas"}</h2>
                {toolLinks.map((link) => (
                  <Link href={link.href} key={link.href}>
                    {link.title}
                  </Link>
                ))}
              </div>
            </aside>
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

function ArticleVisual({ article, compact = false }: { article: SeoArticle; compact?: boolean }) {
  const locale = article.locale;
  const visual = getArticleVisual(article);
  return (
    <figure className={compact ? "blog-visual compact" : "blog-visual"} aria-label={visual.aria}>
      <div className={`blog-visual-screen visual-${visual.kind}`}>
        {visual.kind === "pdf-compress" && (
          <>
            <div className="visual-drop">
              <span>PDF</span>
              <strong>{visual.fileLabel}</strong>
            </div>
            <div className="visual-panel">
              <span>{visual.optionLabel}</span>
              <div className="visual-slider">
                <i style={{ width: "58%" }} />
              </div>
              <small>{visual.outputLabel}</small>
            </div>
          </>
        )}
        {visual.kind === "pdf-merge" && (
          <>
            <div className="visual-doc-stack">
              <span>1</span>
              <span>2</span>
              <span>3</span>
            </div>
            <div className="visual-arrow">+</div>
            <div className="visual-pdf-result">PDF</div>
          </>
        )}
        {visual.kind === "image-pdf" && (
          <>
            <div className="visual-image-grid">
              <span />
              <span />
              <span />
            </div>
            <div className="visual-arrow">→</div>
            <div className="visual-pdf-result">PDF</div>
          </>
        )}
        {visual.kind === "video-compress" && (
          <>
            <div className="visual-video">
              <span />
              <strong>{visual.fileLabel}</strong>
            </div>
            <div className="visual-panel">
              <span>{visual.optionLabel}</span>
              <div className="visual-slider">
                <i style={{ width: "62%" }} />
              </div>
              <small>{visual.outputLabel}</small>
            </div>
          </>
        )}
        {visual.kind === "audio-cut" && (
          <>
            <div className="visual-wave">
              {Array.from({ length: 18 }).map((_, index) => (
                <span key={index} style={{ height: `${18 + ((index * 13) % 46)}px` }} />
              ))}
              <i />
            </div>
            <div className="visual-timeline">
              <span />
              <strong>{visual.outputLabel}</strong>
            </div>
          </>
        )}
        {visual.kind === "converter" && (
          <>
            <div className="visual-converter-box">
              <span>{visual.fileLabel}</span>
              <strong>100</strong>
            </div>
            <div className="visual-arrow">⇄</div>
            <div className="visual-converter-box result">
              <span>{visual.optionLabel}</span>
              <strong>{visual.outputLabel}</strong>
            </div>
          </>
        )}
      </div>
      {!compact && (
        <figcaption>
          <strong>{visual.title}</strong>
          <span>{visual.caption}</span>
        </figcaption>
      )}
    </figure>
  );
}

function getArticleVisual(article: SeoArticle) {
  const en = article.locale === "en";
  const slug = article.slug;
  if (slug.includes("merge") || slug.includes("unir")) {
    return {
      kind: "pdf-merge",
      aria: en ? "Illustration showing several PDF files merged into one PDF" : "Ilustracion de varios PDF unidos en un solo PDF",
      title: en ? "Visual order before merging" : "Orden visual antes de unir",
      caption: en ? "Drag files, check the order and generate one clean PDF." : "Arrastra archivos, revisa el orden y genera un unico PDF.",
      fileLabel: "PDF",
      optionLabel: en ? "Order" : "Orden",
      outputLabel: en ? "Merged" : "Unido"
    } as const;
  }
  if (slug.includes("image") || slug.includes("imagen")) {
    return {
      kind: "image-pdf",
      aria: en ? "Illustration showing images converted into a PDF" : "Ilustracion de imagenes convertidas a PDF",
      title: en ? "Images become one document" : "Imagenes en un solo documento",
      caption: en ? "Upload images, reorder them and export a PDF." : "Sube imagenes, ordenalas y exporta un PDF.",
      fileLabel: "JPG",
      optionLabel: "PDF",
      outputLabel: "PDF"
    } as const;
  }
  if (slug.includes("video")) {
    return {
      kind: "video-compress",
      aria: en ? "Illustration showing video compression controls" : "Ilustracion de controles para comprimir video",
      title: en ? "Preview compression before download" : "Previsualiza la compresion antes de descargar",
      caption: en ? "Trim, reduce resolution and adjust compression percentage." : "Corta, baja resolucion y ajusta el porcentaje de compresion.",
      fileLabel: "MP4",
      optionLabel: en ? "Compression" : "Compresion",
      outputLabel: en ? "Smaller file" : "Menos peso"
    } as const;
  }
  if (slug.includes("audio")) {
    return {
      kind: "audio-cut",
      aria: en ? "Illustration showing an audio waveform with a selected range" : "Ilustracion de una onda de audio con un tramo seleccionado",
      title: en ? "Cut by looking at the waveform" : "Corta mirando la onda",
      caption: en ? "Select the useful fragment, preview it and export." : "Selecciona el fragmento util, escuchalo y exporta.",
      fileLabel: "MP3",
      optionLabel: en ? "Selection" : "Seleccion",
      outputLabel: en ? "Preview" : "Preescucha"
    } as const;
  }
  if (slug.includes("converter") || slug.includes("conversores")) {
    return {
      kind: "converter",
      aria: en ? "Illustration showing an online unit converter" : "Ilustracion de un conversor online",
      title: en ? "Instant conversion" : "Conversion instantanea",
      caption: en ? "Choose source and target units to get the result immediately." : "Elige origen y destino para ver el resultado al momento.",
      fileLabel: en ? "From" : "Origen",
      optionLabel: en ? "To" : "Destino",
      outputLabel: "100"
    } as const;
  }
  return {
    kind: "pdf-compress",
    aria: en ? "Illustration showing a PDF compression workflow" : "Ilustracion de un flujo para comprimir PDF",
    title: en ? "Compression in three steps" : "Compresion en tres pasos",
    caption: en ? "Upload the PDF, choose compression and download the lighter file." : "Sube el PDF, elige compresion y descarga el archivo mas ligero.",
    fileLabel: "PDF",
    optionLabel: en ? "Compression" : "Compresion",
    outputLabel: en ? "Optimized" : "Optimizado"
  } as const;
}

export function UseCasePageView({ page }: { page: UseCasePage }) {
  const locale = page.locale;
  const path = locale === "en" ? `/en/use-cases/${page.slug}` : `/casos/${page.slug}`;
  const toolLinks = getToolLinks([page.primaryTool, ...page.relatedTools], locale);
  const primaryHref = toolPathFromSlug(page.primaryTool, locale);
  const schemas = [
    useCaseSchema(page, path),
    faqSchema(page.faq),
    breadcrumbSchema([
      { name: locale === "en" ? "Home" : "Inicio", href: withLocalePath("/", locale) },
      { name: locale === "en" ? "Use cases" : "Casos de uso", href: locale === "en" ? "/en/use-cases" : "/casos" },
      { name: page.title, href: path }
    ])
  ].filter(Boolean);

  return (
    <div className="site-shell">
      <Header locale={locale} />
      <main>
        <section className="hero compact-hero">
          <div className="container">
            <p className="eyebrow">{locale === "en" ? "Use case" : "Caso de uso"}</p>
            <h1>{page.h1}</h1>
            <p className="lead">{page.description}</p>
            <div className="actions">
              <Link href={primaryHref} className="button">
                {locale === "en" ? "Open tool" : "Abrir herramienta"}
              </Link>
            </div>
          </div>
        </section>
        <div className="container">
          <AdSlot locale={locale} />
        </div>
        <section className="section">
          <div className="container two-column">
            <article className="article seo-article">
              <h2>{locale === "en" ? "Steps" : "Pasos"}</h2>
              <ol>
                {page.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              {page.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                </section>
              ))}
              <h2>{locale === "en" ? "Frequently asked questions" : "Preguntas frecuentes"}</h2>
              <div className="faq-list">
                {page.faq.map((item) => (
                  <section className="faq-item" key={item.question}>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </section>
                ))}
              </div>
            </article>
            <aside className="sidebar">
              <AdSlot locale={locale} />
              <div className="related-list">
                <h2>{locale === "en" ? "Related tools" : "Herramientas relacionadas"}</h2>
                {toolLinks.map((link) => (
                  <Link href={link.href} key={link.href}>
                    {link.title}
                  </Link>
                ))}
              </div>
            </aside>
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

export function UseCaseIndexPage({ locale, pages }: { locale: Locale; pages: UseCasePage[] }) {
  return (
    <div className="site-shell">
      <Header locale={locale} />
      <main>
        <section className="hero compact-hero">
          <div className="container">
            <p className="eyebrow">{locale === "en" ? "Use cases" : "Casos de uso"}</p>
            <h1>{locale === "en" ? "Tool workflows" : "Flujos de trabajo con herramientas"}</h1>
            <p className="lead">
              {locale === "en"
                ? "Pages focused on specific jobs users search for."
                : "Paginas enfocadas a tareas concretas que la gente busca en Google."}
            </p>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <SeoCardGrid
              links={pages.map((page) => ({
                title: page.title,
                href: locale === "en" ? `/en/use-cases/${page.slug}` : `/casos/${page.slug}`,
                description: page.description
              }))}
            />
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
