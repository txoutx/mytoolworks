import type { Locale } from "../i18n";
import type { UseCasePage } from "./types";

export const useCases: UseCasePage[] = [
  {
    slug: "comprimir-video-para-whatsapp",
    locale: "es",
    alternateSlug: "compress-video-for-whatsapp",
    title: "Comprimir video para WhatsApp",
    h1: "Comprimir video para WhatsApp",
    description: "Reduce el peso de un video para enviarlo por WhatsApp con menos espera y mejor compatibilidad.",
    keywords: ["comprimir video para whatsapp", "reducir video whatsapp", "video whatsapp"],
    category: "video",
    dateModified: "2026-06-16",
    primaryTool: "comprimir-video",
    relatedTools: ["cortar-video", "redimensionar-video"],
    steps: ["Sube el video.", "Corta segundos innecesarios.", "Elige resolucion y porcentaje de compresion.", "Previsualiza y descarga."],
    sections: [
      { heading: "Objetivo", body: "Conseguir un archivo mas ligero sin perder la parte importante del video." },
      { heading: "Ajuste recomendado", body: "Empieza con compresion media y baja resolucion si el archivo sigue siendo pesado." }
    ],
    faq: [{ question: "Que hago si sigue pesando mucho?", answer: "Aumenta la compresion, baja resolucion o corta partes innecesarias." }]
  },
  {
    slug: "comprimir-video-para-email",
    locale: "es",
    alternateSlug: "compress-video-for-email",
    title: "Comprimir video para email",
    h1: "Comprimir video para enviar por email",
    description: "Prepara videos mas ligeros para adjuntarlos o compartirlos por correo electronico.",
    keywords: ["comprimir video para email", "reducir video email", "video para correo"],
    category: "video",
    dateModified: "2026-06-16",
    primaryTool: "comprimir-video",
    relatedTools: ["cortar-video", "convertidor-video"],
    steps: ["Sube el video.", "Reduce duracion si sobra contenido.", "Elige compresion manual.", "Descarga y comprueba el peso."],
    sections: [
      { heading: "Limites habituales", body: "Muchos correos limitan adjuntos grandes. Reducir duracion y resolucion suele ser lo mas efectivo." },
      { heading: "Formato", body: "Usa un formato compatible del navegador y comprueba que el destinatario puede abrirlo." }
    ],
    faq: [{ question: "Puedo conservar calidad alta?", answer: "Si el limite de email lo permite. Si no, prioriza duracion y resolucion." }]
  },
  {
    slug: "convertir-imagen-a-pdf-para-enviar",
    locale: "es",
    alternateSlug: "convert-image-to-pdf-for-sending",
    title: "Convertir imagen a PDF para enviar",
    h1: "Convertir imagenes a PDF para enviarlas juntas",
    description: "Convierte fotos, capturas o justificantes en un unico PDF facil de enviar.",
    keywords: ["convertir imagen a pdf para enviar", "jpg a pdf enviar", "fotos a pdf"],
    category: "pdf",
    dateModified: "2026-06-16",
    primaryTool: "jpg-a-pdf",
    relatedTools: ["comprimir-pdf", "pdf-a-jpg"],
    steps: ["Sube las imagenes.", "Ordenalas.", "Genera el PDF.", "Comprime si pesa demasiado."],
    sections: [
      { heading: "Uso tipico", body: "Ideal para enviar varios justificantes, capturas o fotos como un solo documento." },
      { heading: "Orden y peso", body: "Coloca las imagenes en orden y reduce el peso final si el PDF queda grande." }
    ],
    faq: [{ question: "Puedo usar varias imagenes?", answer: "Si, puedes unir varias imagenes dentro del mismo PDF." }]
  },
  {
    slug: "unir-pdf-para-trabajo",
    locale: "es",
    alternateSlug: "merge-pdf-for-work",
    title: "Unir PDF para trabajo",
    h1: "Unir PDF para entregar documentos de trabajo",
    description: "Combina informes, anexos y documentos en un PDF ordenado para trabajo o estudios.",
    keywords: ["unir pdf trabajo", "combinar documentos pdf", "juntar informes pdf"],
    category: "pdf",
    dateModified: "2026-06-16",
    primaryTool: "unir-pdf",
    relatedTools: ["ordenar-pdf", "comprimir-pdf"],
    steps: ["Sube los PDFs.", "Ordena portada, contenido y anexos.", "Une el archivo.", "Comprime si necesitas enviarlo."],
    sections: [
      { heading: "Entrega limpia", body: "Un unico PDF evita documentos sueltos y hace mas facil revisar el contenido." },
      { heading: "Despues de unir", body: "Comprueba paginas y peso antes de enviar el resultado." }
    ],
    faq: [{ question: "Puedo cambiar el orden?", answer: "Si, ordena los documentos antes de unirlos." }]
  },
  {
    slug: "cortar-audio-para-podcast",
    locale: "es",
    alternateSlug: "cut-audio-for-podcast",
    title: "Cortar audio para podcast",
    h1: "Cortar audio para podcast con preescucha",
    description: "Elimina silencios, entradas largas o partes sobrantes antes de publicar un episodio.",
    keywords: ["cortar audio podcast", "editar audio podcast", "trim audio podcast"],
    category: "audio",
    dateModified: "2026-06-16",
    primaryTool: "editor-audio",
    relatedTools: ["mejorar-convertir-audio"],
    steps: ["Sube el audio.", "Busca silencios en la onda.", "Recorta el clip.", "Escucha y exporta."],
    sections: [
      { heading: "Edicion rapida", body: "Un corte visual permite eliminar pausas y entradas largas sin perder el hilo del episodio." },
      { heading: "Preescucha", body: "Escucha el resultado antes de descargar para evitar cortes bruscos." }
    ],
    faq: [{ question: "Puedo quitar silencios?", answer: "Si, el editor incluye opciones pensadas para limpieza y recorte de audio." }]
  },
  {
    slug: "redimensionar-imagen-para-web",
    locale: "es",
    alternateSlug: "resize-image-for-web",
    title: "Redimensionar imagen para web",
    h1: "Redimensionar imagen para web",
    description: "Ajusta imagenes para web, reduce peso y prepara formatos mas rapidos de cargar.",
    keywords: ["redimensionar imagen para web", "optimizar imagen web", "comprimir imagen"],
    category: "img",
    dateModified: "2026-06-16",
    primaryTool: "img",
    relatedTools: ["pdf-a-jpg", "jpg-a-pdf"],
    steps: ["Abre la herramienta de imagen.", "Sube la imagen.", "Ajusta tamano y formato.", "Descarga el resultado optimizado."],
    sections: [
      { heading: "Rendimiento web", body: "Imagenes mas pequenas mejoran carga, Core Web Vitals y experiencia movil." },
      { heading: "Formato", body: "WebP suele ser buena opcion para web; JPG funciona bien para fotografias." }
    ],
    faq: [{ question: "Que tamano uso para web?", answer: "Usa el ancho real donde se vera la imagen y evita subir archivos mucho mayores." }]
  },
  {
    slug: "compress-video-for-whatsapp",
    locale: "en",
    alternateSlug: "comprimir-video-para-whatsapp",
    title: "Compress video for WhatsApp",
    h1: "Compress video for WhatsApp",
    description: "Reduce video size for WhatsApp with manual compression, trimming and compatible export.",
    keywords: ["compress video for whatsapp", "reduce whatsapp video size"],
    category: "video",
    dateModified: "2026-06-16",
    primaryTool: "comprimir-video",
    relatedTools: ["cortar-video", "redimensionar-video"],
    steps: ["Upload the video.", "Trim unnecessary seconds.", "Choose resolution and compression.", "Preview and download."],
    sections: [
      { heading: "Goal", body: "Create a lighter file while keeping the important part of the video." },
      { heading: "Recommended settings", body: "Start with medium compression and lower resolution only if needed." }
    ],
    faq: [{ question: "What if it is still too large?", answer: "Increase compression, lower resolution or trim unnecessary parts." }]
  },
  {
    slug: "compress-video-for-email",
    locale: "en",
    alternateSlug: "comprimir-video-para-email",
    title: "Compress video for email",
    h1: "Compress video for email",
    description: "Prepare lighter videos for email attachments or sharing.",
    keywords: ["compress video for email", "reduce video for email"],
    category: "video",
    dateModified: "2026-06-16",
    primaryTool: "comprimir-video",
    relatedTools: ["cortar-video", "convertidor-video"],
    steps: ["Upload the video.", "Trim if needed.", "Choose manual compression.", "Download and check size."],
    sections: [
      { heading: "Email limits", body: "Many email providers limit large attachments, so duration and resolution matter." },
      { heading: "Format", body: "Use a browser-compatible output and check that the receiver can open it." }
    ],
    faq: [{ question: "Can I keep high quality?", answer: "Yes, if the email size limit allows it." }]
  },
  {
    slug: "convert-image-to-pdf-for-sending",
    locale: "en",
    alternateSlug: "convertir-imagen-a-pdf-para-enviar",
    title: "Convert image to PDF for sending",
    h1: "Convert images to PDF for sending",
    description: "Turn photos, screenshots or receipts into one easy-to-send PDF.",
    keywords: ["convert image to pdf for sending", "jpg to pdf"],
    category: "pdf",
    dateModified: "2026-06-16",
    primaryTool: "jpg-a-pdf",
    relatedTools: ["comprimir-pdf", "pdf-a-jpg"],
    steps: ["Upload images.", "Order them.", "Create the PDF.", "Compress if needed."],
    sections: [
      { heading: "Typical use", body: "Best for sending several receipts, screenshots or photos as one document." },
      { heading: "Order and size", body: "Order images and reduce final file size if needed." }
    ],
    faq: [{ question: "Can I use multiple images?", answer: "Yes, you can put several images in one PDF." }]
  },
  {
    slug: "merge-pdf-for-work",
    locale: "en",
    alternateSlug: "unir-pdf-para-trabajo",
    title: "Merge PDF for work",
    h1: "Merge PDF documents for work",
    description: "Combine reports, attachments and documents into one ordered PDF.",
    keywords: ["merge pdf for work", "combine pdf documents"],
    category: "pdf",
    dateModified: "2026-06-16",
    primaryTool: "unir-pdf",
    relatedTools: ["ordenar-pdf", "comprimir-pdf"],
    steps: ["Upload PDFs.", "Order cover, content and attachments.", "Merge the file.", "Compress if needed."],
    sections: [
      { heading: "Clean delivery", body: "One PDF avoids scattered files and is easier to review." },
      { heading: "After merging", body: "Check pages and file size before sending." }
    ],
    faq: [{ question: "Can I change the order?", answer: "Yes, order documents before merging." }]
  },
  {
    slug: "cut-audio-for-podcast",
    locale: "en",
    alternateSlug: "cortar-audio-para-podcast",
    title: "Cut audio for podcast",
    h1: "Cut podcast audio with preview",
    description: "Remove silence, long intros or unnecessary parts before publishing an episode.",
    keywords: ["cut audio for podcast", "edit podcast audio"],
    category: "audio",
    dateModified: "2026-06-16",
    primaryTool: "editor-audio",
    relatedTools: ["mejorar-convertir-audio"],
    steps: ["Upload audio.", "Find silence in the waveform.", "Trim the clip.", "Preview and export."],
    sections: [
      { heading: "Fast editing", body: "Visual cuts help remove pauses and long intros without losing context." },
      { heading: "Preview", body: "Listen before downloading to avoid abrupt edits." }
    ],
    faq: [{ question: "Can I remove silence?", answer: "The editor includes options for audio cleanup and trimming." }]
  },
  {
    slug: "resize-image-for-web",
    locale: "en",
    alternateSlug: "redimensionar-imagen-para-web",
    title: "Resize image for web",
    h1: "Resize image for web",
    description: "Adjust images for websites, reduce file size and prepare faster-loading formats.",
    keywords: ["resize image for web", "optimize image for web"],
    category: "img",
    dateModified: "2026-06-16",
    primaryTool: "img",
    relatedTools: ["pdf-a-jpg", "jpg-a-pdf"],
    steps: ["Open the image tool.", "Upload the image.", "Adjust size and format.", "Download the optimized result."],
    sections: [
      { heading: "Web performance", body: "Smaller images improve loading, Core Web Vitals and mobile experience." },
      { heading: "Format", body: "WebP is a strong web option; JPG works well for photos." }
    ],
    faq: [{ question: "Which size should I use?", answer: "Use the real display width and avoid uploading much larger files." }]
  }
];

export function getUseCases(locale?: Locale) {
  return locale ? useCases.filter((item) => item.locale === locale) : useCases;
}

export function getUseCase(locale: Locale, slug: string) {
  return useCases.find((item) => item.locale === locale && item.slug === slug);
}
