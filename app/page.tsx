import Link from "next/link";
import { FileImage, FileText } from "lucide-react";
import { AdSlot, Footer, Header } from "./components/SiteChrome";

export default function Home() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="hero compact-hero">
          <div className="container">
            <p className="eyebrow">Herramientas online</p>
            <h1>MyToolWorks</h1>
            <p className="lead">Elige una categoria y trabaja con PDFs o imagenes directamente desde el navegador.</p>
          </div>
        </section>

        <div className="container">
          <AdSlot />
        </div>

        <section className="home-category-section">
          <div className="container">
            <div className="home-category-grid">
              <Link href="/pdf" className="home-category-card">
                <div className="home-category-icon" aria-hidden="true">
                  <FileText size={28} />
                </div>
                <h2>PDF Tools</h2>
                <p>Une, divide, comprime, rota, ordena, convierte a imagen y firma archivos PDF.</p>
                <div className="category-preview-list">
                  <span>Unir PDF</span>
                  <span>Comprimir</span>
                  <span>Firmar</span>
                </div>
                <footer>Abrir PDF</footer>
              </Link>

              <Link href="/img" className="home-category-card">
                <div className="home-category-icon" aria-hidden="true">
                  <FileImage size={28} />
                </div>
                <h2>Imagen</h2>
                <p>Edita, comprime, convierte, redimensiona, recorta y descarga imagenes online.</p>
                <div className="category-preview-list">
                  <span>Redimensionar</span>
                  <span>WebP/JPG/PNG</span>
                  <span>Marca de agua</span>
                </div>
                <footer>Abrir imagen</footer>
              </Link>
            </div>
          </div>
        </section>

        <div className="container bottom-ad">
          <AdSlot label="Anuncio inferior" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
