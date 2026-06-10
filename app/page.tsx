import { Footer, Header } from "./components/SiteChrome";
import { ToolCard } from "./components/ToolCard";
import { getToolsByCategory } from "./data/tools";

export default function Home() {
  const pdfTools = getToolsByCategory("pdf");

  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="home-hero">
          <div className="container home-hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">Herramientas PDF</p>
              <h1>MyToolWorks</h1>
              <p className="lead">Unir, dividir, comprimir, rotar, ordenar, convertir y firmar PDF.</p>
            </div>
          </div>
        </section>

        <section className="home-tool-section">
          <div className="container">
            <div className="section-heading clean">
              <div>
                <h2>PDF Tools</h2>
                <p>Elige una herramienta y trabaja directamente desde el navegador.</p>
              </div>
            </div>
            <div className="showcase-grid">
              {pdfTools.map((tool) => (
                <ToolCard tool={tool} variant="showcase" key={tool.route} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
