import type { Metadata } from "next";
import { AdSlot, Footer, Header } from "../components/SiteChrome";
import { ImageTool } from "./ImageTool";

export const metadata: Metadata = {
  title: "Herramientas de imagen online",
  description: "Edita, comprime, redimensiona, convierte, rota y descarga imagenes online desde el navegador.",
  alternates: {
    canonical: "/img"
  },
  openGraph: {
    title: "Herramientas de imagen online",
    description: "Edita, comprime, redimensiona, convierte, rota y descarga imagenes online desde el navegador.",
    url: "https://mytoolworks.com/img",
    type: "website"
  }
};

export default function ImagePage() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="hero compact-hero">
          <div className="container">
            <p className="eyebrow">Imagen</p>
            <h1>Herramientas de imagen online</h1>
            <p className="lead">
              Edita, comprime, convierte, redimensiona y descarga imagenes directamente desde el navegador.
            </p>
          </div>
        </section>

        <div className="container">
          <AdSlot label="Anuncio superior" />
        </div>

        <section className="section">
          <div className="container">
            <ImageTool />
          </div>
        </section>

        <div className="container bottom-ad">
          <AdSlot label="Anuncio inferior" />
        </div>

        <section className="section">
          <div className="container">
            <div className="article tool-seo-content">
              <h2>Que puedes hacer</h2>
              <p>
                Puedes cambiar el lienzo final, mover la imagen dentro, escalarla, convertirla a JPG, PNG, WebP o AVIF,
                reducir su peso, rotarla, voltearla y anadir una marca de agua de texto.
              </p>
              <h2>Ventajas de trabajar en el navegador</h2>
              <p>
                La imagen se procesa localmente con canvas. No se sube a un servidor, por lo que el flujo es rapido y
                privado para ediciones basicas.
              </p>
              <h2>Formatos compatibles</h2>
              <p>La herramienta acepta JPG, PNG, WebP y AVIF si tu navegador lo soporta.</p>
              <h2>Preguntas frecuentes</h2>
              <div className="faq-list">
                <section className="faq-item">
                  <h3>Mis imagenes se suben a un servidor?</h3>
                  <p>No, el procesamiento se realiza localmente en tu navegador.</p>
                </section>
                <section className="faq-item">
                  <h3>Que formatos puedo usar?</h3>
                  <p>Puedes trabajar con JPG, PNG, WebP y otros formatos compatibles con tu navegador.</p>
                </section>
                <section className="faq-item">
                  <h3>Puedo reducir el peso de una imagen?</h3>
                  <p>Si, puedes ajustar la calidad y exportar la imagen comprimida.</p>
                </section>
                <section className="faq-item">
                  <h3>Puedo cambiar el tamano de una imagen?</h3>
                  <p>Si, puedes modificar ancho, alto o escalar por porcentaje.</p>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
