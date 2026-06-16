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
            <SeoCardGrid
              links={articles.map((article) => ({
                title: article.title,
                href: withLocalePath(`/blog/${article.slug}`, locale),
                description: article.description
              }))}
            />
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
