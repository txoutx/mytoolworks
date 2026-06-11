import { Footer, Header } from "./SiteChrome";
import type { ReactNode } from "react";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function LegalPage({ eyebrow, title, description, children }: LegalPageProps) {
  return (
    <div className="site-shell">
      <Header />
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
      <Footer />
    </div>
  );
}
