import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot, Footer, Header } from "../../components/SiteChrome";
import { ToolCard } from "../../components/ToolCard";
import { ToolRunner } from "../../components/ToolRunner";
import type { Tool } from "../../data/tools";
import { categories, getCategory, getRelatedTools, getTool, tools } from "../../data/tools";
import type { Locale } from "../../../lib/i18n";
import { localizeCategory, localizeTool, ui, withLocalePath } from "../../../lib/i18n";

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

  return <ToolPageContent tool={tool} locale="es" />;
}

function ToolPageContent({ tool: sourceTool, locale }: { tool: Tool; locale: Locale }) {
  const tool = localizeTool(sourceTool, locale);
  const sourceCategory = getCategory(sourceTool.categorySlug);
  const category = sourceCategory ? localizeCategory(sourceCategory, locale) : undefined;
  const related = getRelatedTools(sourceTool).map((item) => localizeTool(item, locale));
  const seoContent = getToolSeoContent(tool, locale);
  const t = ui[locale];
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
        name: locale === "en" ? "Home" : "Inicio",
        item: `https://mytoolworks.com${withLocalePath("/", locale)}`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category?.title ?? tool.categorySlug,
        item: `https://mytoolworks.com${withLocalePath(`/${tool.categorySlug}`, locale)}`
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
      <Header locale={locale} />
      <main>
        <section className="hero compact-hero">
          <div className="container">
            <p className="eyebrow">{category?.shortTitle ?? tool.categorySlug}</p>
            <h1>{tool.h1}</h1>
            <p className="lead">{tool.description}</p>
          </div>
        </section>
        <div className="container tool-top-ad">
          <AdSlot label={t.topAd} locale={locale} />
        </div>
        <div className="container two-column">
          <article>
            <ToolRunner tool={tool} locale={locale} />
            <div className="tool-result-ad">
              <AdSlot label={t.resultAd} locale={locale} />
            </div>
            <div className="article tool-seo-content">
              <h2>{seoContent.heading}</h2>
              <p>{seoContent.intro}</p>
              <h2>{locale === "en" ? `How to use ${tool.title}` : `Como usar ${tool.title}`}</h2>
              <ol>
                {seoContent.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <h2>{locale === "en" ? "Privacy" : "Privacidad"}</h2>
              <p>
                {locale === "en"
                  ? "For browser-based tools, files are processed locally whenever possible. Conversions that need a specialized server should use temporary storage and automatic cleanup when the backend is connected."
                  : "En las herramientas disponibles en navegador, el archivo se procesa localmente siempre que sea posible. Las conversiones que requieren servidor especializado deberan usar almacenamiento temporal y limpieza automatica cuando se conecte el backend."}
              </p>
              <h2>{locale === "en" ? "Frequently asked questions" : "Preguntas frecuentes"}</h2>
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
            <AdSlot label={t.sideAd} locale={locale} />
            <div className="related-list">
              <h2>{t.related}</h2>
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
      <Footer locale={locale} />
    </div>
  );
}

function getToolSeoContent(tool: Tool, locale: Locale = "es") {
  if (locale === "en") return getEnglishToolSeoContent(tool);
  if (tool.kind === "audio") {
    return {
      heading: `${tool.title} gratis y online`,
      intro: `${tool.description} El procesamiento se realiza en el navegador usando Web Audio API, por lo que los archivos no se suben a un servidor.`,
      steps: ["Sube uno o varios archivos de audio.", "Elige el tramo, union, fades, velocidad, canales o mejoras disponibles.", "Reproduce la seleccion para comprobar el resultado.", "Genera y descarga el archivo WAV final."],
      faqs: [
        {
          question: `Puedo usar ${tool.title} gratis?`,
          answer: "Si, la herramienta funciona gratis en el navegador."
        },
        {
          question: "Se suben mis audios a un servidor?",
          answer: "No. La edicion disponible se procesa localmente en tu navegador."
        },
        {
          question: "Puede exportar MP3, AAC, OGG o FLAC?",
          answer: "La salida estable en navegador es WAV. Para codificar MP3, AAC o FLAC reales haria falta conectar un backend con codificadores dedicados."
        },
        {
          question: "Puedo unir varios audios?",
          answer: tool.slug === "editor-audio" ? "Si, selecciona varios archivos y usa el modo Unir audios." : "Esta herramienta se centra en mejora y conversion; para unir archivos usa el Editor de audio."
        },
        {
          question: "Funciona en movil?",
          answer: "Si, aunque archivos largos consumen bastante memoria y funcionan mejor en escritorio."
        }
      ]
    };
  }
  if (tool.kind === "converter") {
    if (tool.slug === "hora-mundial") {
      return {
        heading: `${tool.title} gratis y online`,
        intro: `${tool.description} Sirve para planificar reuniones, viajes, entregas o llamadas sin calcular diferencias horarias a mano.`,
        steps: ["Revisa tu hora local en el primer reloj.", "Busca un pais, ciudad o zona horaria.", "Selecciona el resultado que quieras consultar.", "Compara la hora seleccionada con otras zonas populares."],
        faqs: [
          {
            question: `Puedo usar ${tool.title} gratis?`,
            answer: "Si, el conversor funciona gratis desde el navegador."
          },
          {
            question: "Tiene en cuenta el cambio de hora?",
            answer: "Si, usa las zonas horarias del navegador, por lo que respeta horario de verano e invierno cuando la zona lo aplica."
          },
          {
            question: "Funciona en movil?",
            answer: "Si, el formulario y los relojes son responsive."
          },
          {
            question: "Puedo buscar cualquier pais?",
            answer: "Puedes buscar por pais, ciudad o nombre tecnico de zona horaria. El navegador ofrece una lista amplia de zonas internacionales."
          },
          {
            question: "Se envia algun dato?",
            answer: "No. La conversion se calcula en el navegador."
          }
        ]
      };
    }
    return {
      heading: `${tool.title} gratis y online`,
      intro: `${tool.description} Es un conversor rapido para consultar equivalencias sin instalar nada y desde cualquier dispositivo.`,
      steps: ["Introduce la cantidad que quieres convertir.", "Elige la unidad o divisa de origen.", "Selecciona la unidad de destino.", "Consulta el resultado instantaneo y las conversiones rapidas."],
      faqs: [
        {
          question: `Puedo usar ${tool.title} gratis?`,
          answer: "Si, el conversor funciona gratis desde el navegador."
        },
        {
          question: "Se envia algun archivo?",
          answer: "No. Esta herramienta solo calcula valores numericos en el navegador."
        },
        {
          question: "Funciona en movil?",
          answer: "Si, el formulario es responsive y se adapta a movil, tablet y escritorio."
        },
        {
          question: "Los resultados son exactos?",
          answer: tool.slug === "divisa" ? "Las divisas son orientativas porque no se actualizan en tiempo real." : "Las conversiones usan factores estandar habituales para cada unidad."
        },
        {
          question: "Puedo intercambiar origen y destino?",
          answer: "Si, usa el boton de intercambiar para cambiar rapidamente la direccion de la conversion."
        }
      ]
    };
  }
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

function getEnglishToolSeoContent(tool: Tool) {
  if (tool.kind === "audio") {
    return {
      heading: `${tool.title} free online`,
      intro: `${tool.description} Processing runs in the browser with the Web Audio API, so files are not uploaded to a server.`,
      steps: ["Upload one or more audio files.", "Choose the segment, merge mode, fades, speed, channels or enhancements.", "Play the selection to check it.", "Generate and download the final WAV file."],
      faqs: [
        {
          question: `Can I use ${tool.title} for free?`,
          answer: "Yes, the tool works for free in the browser."
        },
        {
          question: "Are my audio files uploaded?",
          answer: "No. Available editing runs locally in your browser."
        },
        {
          question: "Can it export MP3, AAC, OGG or FLAC?",
          answer: "The stable browser output is WAV. Real MP3, AAC or FLAC encoding requires a backend with dedicated encoders."
        },
        {
          question: "Can I merge multiple audio files?",
          answer: tool.slug === "editor-audio" ? "Yes, select multiple files and use Merge audio mode." : "This tool focuses on enhancement and conversion; use the Audio editor to merge files."
        },
        {
          question: "Does it work on mobile?",
          answer: "Yes, although long files use a lot of memory and work better on desktop."
        }
      ]
    };
  }
  if (tool.kind === "converter") {
    if (tool.slug === "hora-mundial") {
      return {
        heading: `${tool.title} free online`,
        intro: `${tool.description} Use it to plan meetings, travel, deliveries or calls without calculating time differences manually.`,
        steps: ["Check your local time in the first clock.", "Search for a country, city or time zone.", "Select the result you want to check.", "Compare the selected time with popular zones."],
        faqs: [
          {
            question: `Can I use ${tool.title} for free?`,
            answer: "Yes, the converter works for free in the browser."
          },
          {
            question: "Does it handle daylight saving time?",
            answer: "Yes, it uses browser time zones, so daylight saving rules are applied when the zone uses them."
          },
          {
            question: "Does it work on mobile?",
            answer: "Yes, the form and clocks are responsive."
          },
          {
            question: "Can I search any country?",
            answer: "You can search by country, city or technical time zone name. The browser provides a broad list of international zones."
          },
          {
            question: "Is any data sent?",
            answer: "No. The conversion is calculated in the browser."
          }
        ]
      };
    }
    return {
      heading: `${tool.title} free online`,
      intro: `${tool.description} A fast converter for checking equivalences without installing anything, from any device.`,
      steps: ["Enter the amount you want to convert.", "Choose the source unit or currency.", "Select the target unit.", "Check the instant result and quick conversions."],
      faqs: [
        {
          question: `Can I use ${tool.title} for free?`,
          answer: "Yes, the converter works for free in the browser."
        },
        {
          question: "Is any file uploaded?",
          answer: "No. This tool only calculates numeric values in the browser."
        },
        {
          question: "Does it work on mobile?",
          answer: "Yes, the form is responsive and adapts to mobile, tablet and desktop."
        },
        {
          question: "Are the results exact?",
          answer: tool.slug === "divisa" ? "Currency values are indicative because they are not updated in real time." : "Conversions use common standard factors for each unit."
        },
        {
          question: "Can I swap source and target?",
          answer: "Yes, use the swap button to quickly change the conversion direction."
        }
      ]
    };
  }
  const baseSteps = [
    tool.input === "html" ? "Paste the URL you want to convert." : "Upload the file from your device.",
    "Check the preview and adjust the available options.",
    `Click the ${tool.title.toLowerCase()} button.`,
    "Download the result when processing is complete."
  ];

  const bySlug: Record<string, { intro: string; steps?: string[] }> = {
    "unir-pdf": {
      intro: "Merge several PDF files into a single document. You can drag PDFs to define the order before generating the final file.",
      steps: ["Upload two or more PDFs.", "Drag the cards to order the documents.", "Check the visual numbering.", "Click Merge PDF and download the result."]
    },
    "dividir-pdf": {
      intro: "Extract specific pages from a PDF by selecting them visually. Useful for separating chapters, invoices or individual pages.",
      steps: ["Upload a PDF.", "Click the pages you want to extract.", "Check that they are selected.", "Click Split PDF to download the selected pages."]
    },
    "comprimir-pdf": {
      intro: "Reduce PDF file size by trying different compression levels. If the document is already optimized, the tool avoids downloading a heavier version.",
      steps: ["Upload the PDF.", "Choose the compression level.", "Process the file.", "Download only when a lighter version is created."]
    },
    "rotar-pdf": {
      intro: "Rotate full PDF pages or selected pages to fix scanned documents, forms or landscape pages.",
      steps: ["Upload the PDF.", "Select specific pages or rotate all pages.", "Apply the needed orientation.", "Download the rotated PDF."]
    },
    "ordenar-pdf": {
      intro: "Reorganize PDF pages with visual cards. Drag each page until the document is in the correct order.",
      steps: ["Upload the PDF.", "Drag pages in the visual view.", "Review the final numbering.", "Download the reordered PDF."]
    },
    "pdf-a-jpg": {
      intro: "Convert PDF pages to images and choose JPG, PNG or WebP. Export one page or several pages in a ZIP.",
      steps: ["Upload the PDF.", "Select pages if you do not want all of them.", "Choose the image format.", "Download the image or ZIP."]
    },
    "jpg-a-pdf": {
      intro: "Convert images into a PDF. It works with JPG, PNG, WebP and other formats your browser can read.",
      steps: ["Upload one or more images.", "Order them visually if needed.", "Generate the PDF.", "Download the final document."]
    },
    "html-a-pdf": {
      intro: "Convert a public URL into PDF. A fast way to save a web page as a document.",
      steps: ["Paste a public URL starting with http:// or https://.", "Click convert.", "Wait for the server to generate the PDF.", "Download the file."]
    },
    "firmar-pdf": {
      intro: "Draw a signature, save it and drag it onto the PDF. You can place several signatures, move, scale or remove them before downloading.",
      steps: ["Upload the PDF.", "Draw a signature in the side panel.", "Add it and drag it to the page you want.", "Adjust size and download the signed PDF."]
    }
  };

  const override = bySlug[tool.slug];

  return {
    heading: `${tool.title} free online`,
    intro: override?.intro ?? `${tool.description} This page is designed for fast browser-based work with a clean interface.`,
    steps: override?.steps ?? baseSteps,
    faqs: [
      {
        question: `Can I use ${tool.title} for free?`,
        answer: "Yes, the tool is designed for free online use. Some advanced conversions may require a specialized backend."
      },
      {
        question: "Are my files stored?",
        answer:
          tool.processing === "client"
            ? "In this tool, processing runs in the browser whenever possible."
            : "This tool needs a backend for professional output; when connected, it should use temporary storage and automatic cleanup."
      },
      {
        question: "Does it work on mobile?",
        answer: "Yes, the interface is responsive and prepared for mobile, tablet and desktop."
      },
      {
        question: "Can I reorder or select pages?",
        answer:
          ["unir-pdf", "dividir-pdf", "ordenar-pdf", "rotar-pdf", "pdf-a-jpg"].includes(tool.slug)
            ? "Yes, this tool includes visual selection or reordering depending on the task."
            : "It depends on the tool. Available options appear in the workspace after you upload a file."
      },
      {
        question: "Is there a size limit?",
        answer: "The practical limit depends on your browser, available memory and, when a backend exists, server limits."
      }
    ]
  };
}
