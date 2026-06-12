import { Footer, Header } from "./SiteChrome";
import type { ReactNode } from "react";
import type { Locale } from "../../lib/i18n";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  locale?: Locale;
};

export function LegalPage({ eyebrow, title, description, children, locale = "es" }: LegalPageProps) {
  return (
    <div className="site-shell">
      <Header locale={locale} />
      <main>
        <section className="hero compact-hero">
          <div className="container">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="lead">{description}</p>
          </div>
        </section>
        <section className="section">
          <div className="container legal-layout">
            <article className="legal-card article">{children}</article>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
