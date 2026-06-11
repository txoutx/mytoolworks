import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot, Footer, Header } from "../../components/SiteChrome";
import { ToolCard } from "../../components/ToolCard";
import { ToolRunner } from "../../components/ToolRunner";
import type { Tool } from "../../data/tools";
import { categories, getCategory, getRelatedTools, getTool, tools } from "../../data/tools";

type PageProps = {
  params: Promise<{ categorySlug: string; toolSlug: string }>;
};

export function generateStaticParams() {
  return tools.map((tool) => ({
    categorySlug: tool.categorySlug,
    toolSlug: tool.slug
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug, toolSlug } = await params;
  const tool = getTool(categorySlug, toolSlug);

  if (!tool) return {};

  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: tool.route
    },
    openGraph: {
      title: tool.h1,
      description: tool.description,
      url: `https://mytoolworks.com${tool.route}`,
      type: "website"
    }
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { categorySlug, toolSlug } = await params;
  const tool = getTool(categorySlug, toolSlug);

  if (!tool) notFound();

  const category = getCategory(tool.categorySlug);
  const related = getRelatedTools(tool);
  const seoContent = getToolSeoContent(tool);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.h1,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    url: `https://mytoolworks.com${tool.route}`,
    description: tool.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR"
    }
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://mytoolworks.com"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category?.title ?? tool.categorySlug,
        item: `https://mytoolworks.com/${tool.categorySlug}`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.title,
        item: `https://mytoolworks.com${tool.route}`
      }
    ]
  };

  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="hero compact-hero">
          <div className="container">
            <p className="eyebrow">{category?.shortTitle ?? tool.categorySlug}</p>
            <h1>{tool.h1}</h1>
            <p className="lead">{tool.description}</p>
          </div>
        </section>
        <div className="container tool-top-ad">
          <AdSlot label="Anuncio superior" />
        </div>
        <div className="container two-column">
          <article>
            <ToolRunner tool={tool} />
            <div className="tool-result-ad">
              <AdSlot label="Anuncio despues del resultado" />
            </div>
            <div className="article tool-seo-content">
              <h2>{seoContent.heading}</h2>
              <p>{seoContent.intro}</p>
              <h2>Como usar {tool.title}</h2>
              <ol>
                {seoContent.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <h2>Detalles de la herramienta</h2>
              <ul>
                <li>Modo: {tool.processing === "client" ? "en el navegador" : "requiere backend especializado"}.</li>
                <li>Entrada: {tool.input}.</li>
                <li>Salida: {tool.output}.</li>
              </ul>
              <h2>Privacidad</h2>
              <p>
                En las herramientas disponibles en navegador, el archivo se procesa localmente siempre que sea posible.
                Las conversiones que requieren servidor especializado deberan usar almacenamiento temporal y limpieza
                automatica cuando se conecte el backend.
              </p>
              <h2>Preguntas frecuentes</h2>
              <div className="faq-list">
                {seoContent.faqs.map((item) => (
                  <section className="faq-item" key={item.question}>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </section>
                ))}
              </div>
            </div>
          </article>
          <aside className="sidebar">
            <AdSlot label="Anuncio lateral" />
            <div className="related-list">
              <h2>Relacionadas</h2>
              {related.map((item) => (
                <a href={item.route} key={item.route}>
                  {item.title}
                </a>
              ))}
            </div>
          </aside>
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Footer />
    </div>
  );
}

function getToolSeoContent(tool: Tool) {
  const baseSteps = [
    tool.input === "html" ? "Pega la URL que quieres convertir." : "Sube el archivo desde tu dispositivo.",
    "Revisa la vista previa y ajusta las opciones disponibles.",
    `Pulsa el boton de ${tool.title.toLowerCase()}.`,
    "Descarga el resultado cuando termine el proceso."
  ];

  const bySlug: Record<string, { intro: string; steps?: string[] }> = {
    "unir-pdf": {
      intro: "Une varios archivos PDF en un solo documento. Puedes arrastrar los PDFs para definir el orden antes de generar el archivo final.",
      steps: ["Sube dos o mas PDFs.", "Arrastra las tarjetas para ordenar los documentos.", "Comprueba la numeracion visual.", "Pulsa Unir PDF y descarga el resultado."]
    },
    "dividir-pdf": {
      intro: "Extrae paginas concretas de un PDF seleccionandolas visualmente. Es util para separar capitulos, facturas o paginas sueltas.",
      steps: ["Sube un PDF.", "Haz clic en las paginas que quieres extraer.", "Comprueba que estan marcadas.", "Pulsa Dividir PDF para descargar las paginas seleccionadas."]
    },
    "comprimir-pdf": {
      intro: "Reduce el peso de un PDF probando diferentes niveles de compresion. Si el documento ya esta optimizado, la herramienta evita descargar una version mas pesada.",
      steps: ["Sube el PDF.", "Elige el nivel de compresion.", "Procesa el archivo.", "Descarga solo si se consigue una version mas ligera."]
    },
    "rotar-pdf": {
      intro: "Gira paginas PDF completas o seleccionadas para corregir documentos escaneados, formularios o paginas en horizontal.",
      steps: ["Sube el PDF.", "Selecciona paginas concretas o elige rotar todo.", "Aplica la orientacion necesaria.", "Descarga el PDF rotado."]
    },
    "ordenar-pdf": {
      intro: "Reorganiza paginas de un PDF con tarjetas visuales. Arrastra cada pagina hasta dejar el documento en el orden correcto.",
      steps: ["Sube el PDF.", "Arrastra las paginas en la vista visual.", "Revisa la numeracion final.", "Descarga el PDF reordenado."]
    },
    "pdf-a-jpg": {
      intro: "Convierte paginas PDF a imagen y elige entre JPG, PNG o WebP. Puedes exportar una pagina o varias en un ZIP.",
      steps: ["Sube el PDF.", "Selecciona las paginas si no quieres exportarlas todas.", "Elige formato de imagen.", "Descarga la imagen o el ZIP."]
    },
    "jpg-a-pdf": {
      intro: "Convierte imagenes en un PDF. Sirve para JPG, PNG, WebP y otros formatos que el navegador pueda leer.",
      steps: ["Sube una o varias imagenes.", "Ordenalas visualmente si hace falta.", "Genera el PDF.", "Descarga el documento final."]
    },
    "html-a-pdf": {
      intro: "Convierte una URL publica en PDF. Es una forma rapida de guardar una pagina web como documento.",
      steps: ["Pega una URL publica que empiece por http:// o https://.", "Pulsa convertir.", "Espera a que el servidor genere el PDF.", "Descarga el archivo."]
    },
    "firmar-pdf": {
      intro: "Dibuja una firma, guardala y arrastrala sobre el PDF. Puedes colocar varias firmas, moverlas, escalarlas o quitarlas antes de descargar.",
      steps: ["Sube el PDF.", "Dibuja una firma en el panel lateral.", "Anadela y arrastrala a la pagina que quieras.", "Ajusta tamano y descarga el PDF firmado."]
    }
  };

  const override = bySlug[tool.slug];

  return {
    heading: `${tool.title} gratis y online`,
    intro: override?.intro ?? `${tool.description} Esta pagina esta pensada para trabajar de forma rapida desde el navegador y con una interfaz limpia.`,
    steps: override?.steps ?? baseSteps,
    faqs: [
      {
        question: `Puedo usar ${tool.title} gratis?`,
        answer: "Si, la herramienta esta planteada para uso online gratuito. Algunas conversiones avanzadas pueden requerir backend especializado."
      },
      {
        question: "Se guardan mis archivos?",
        answer:
          tool.processing === "client"
            ? "En esta herramienta el procesamiento se realiza en el navegador siempre que sea posible."
            : "Esta herramienta necesita backend para resultado profesional; al conectarlo debera usarse almacenamiento temporal y limpieza automatica."
      },
      {
        question: "Funciona en movil?",
        answer: "Si, la interfaz es responsive y esta preparada para usarse en movil, tablet y escritorio."
      },
      {
        question: "Puedo cambiar el orden o seleccionar paginas?",
        answer:
          ["unir-pdf", "dividir-pdf", "ordenar-pdf", "rotar-pdf", "pdf-a-jpg"].includes(tool.slug)
            ? "Si, esta herramienta incluye seleccion o reordenacion visual segun el tipo de tarea."
            : "Depende de la herramienta. Las opciones visibles aparecen en la zona de trabajo cuando subes el archivo."
      },
      {
        question: "Hay limite de tamano?",
        answer: "El limite practico depende del navegador, memoria disponible y, cuando exista backend, de los limites configurados en el servidor."
      }
    ]
  };
}
