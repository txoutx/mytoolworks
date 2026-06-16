export type ToolCategorySlug = "pdf" | "img" | "conversor" | "audio" | "video";

export type ToolKind =
  | "pdf"
  | "mortgage"
  | "salary"
  | "converter"
  | "scientific"
  | "cv"
  | "letter"
  | "summary"
  | "grammar"
  | "audio"
  | "video";

export type ProcessingMode = "client" | "backend-required";

export type AdProfile = "light" | "standard" | "high-intent";

export type ToolCategory = {
  slug: ToolCategorySlug;
  title: string;
  shortTitle: string;
  description: string;
  navLabel: string;
};

export type Tool = {
  slug: string;
  legacySlug?: string;
  route: string;
  title: string;
  h1: string;
  categorySlug: ToolCategorySlug;
  group: string;
  description: string;
  keywords: string[];
  status: "Disponible" | "Requiere backend";
  kind: ToolKind;
  processing: ProcessingMode;
  input: "single-file" | "multi-file" | "office-file" | "html";
  output: "pdf" | "jpg" | "text" | "calculation" | "audio" | "video";
  adProfile: AdProfile;
};

export const categories: ToolCategory[] = [
  {
    slug: "pdf",
    title: "PDF",
    shortTitle: "PDF",
    navLabel: "PDF",
    description: "Unir, dividir, comprimir, rotar, ordenar, convertir y firmar PDF."
  },
  {
    slug: "img",
    title: "Imagen",
    shortTitle: "Imagen",
    navLabel: "Imagen",
    description: "Edita, comprime, convierte, redimensiona y descarga imagenes desde el navegador."
  },
  {
    slug: "audio",
    title: "Audio",
    shortTitle: "Audio",
    navLabel: "Audio",
    description: "Corta, une, convierte, comprime, mejora y ajusta archivos de audio desde el navegador."
  },
  {
    slug: "video",
    title: "Video",
    shortTitle: "Video",
    navLabel: "Video",
    description: "Corta, une, recorta, ajusta y exporta videos con un editor visual tipo timeline."
  },
  {
    slug: "conversor",
    title: "Conversores",
    shortTitle: "Conversores",
    navLabel: "Conversores",
    description: "Convierte divisas, unidades, horas, zonas horarias, temperatura, peso, datos digitales, area, volumen y energia."
  }
];

const pdfBase = {
  categorySlug: "pdf" as const,
  kind: "pdf" as const,
  adProfile: "standard" as const
};

const converterBase = {
  categorySlug: "conversor" as const,
  kind: "converter" as const,
  status: "Disponible" as const,
  processing: "client" as const,
  input: "single-file" as const,
  output: "calculation" as const,
  adProfile: "light" as const
};

const audioBase = {
  categorySlug: "audio" as const,
  kind: "audio" as const,
  status: "Disponible" as const,
  processing: "client" as const,
  input: "multi-file" as const,
  output: "audio" as const,
  adProfile: "standard" as const
};

const videoBase = {
  categorySlug: "video" as const,
  kind: "video" as const,
  status: "Disponible" as const,
  processing: "client" as const,
  input: "multi-file" as const,
  output: "video" as const,
  adProfile: "high-intent" as const
};

export const tools: Tool[] = [
  {
    ...pdfBase,
    slug: "unir-pdf",
    route: "/pdf/unir-pdf",
    title: "Unir PDF",
    h1: "Unir PDF online",
    group: "Organizar",
    description: "Ordena varios PDFs visualmente y unelos en un solo archivo.",
    keywords: ["unir pdf", "juntar pdf", "combinar pdf"],
    status: "Disponible",
    processing: "client",
    input: "multi-file",
    output: "pdf"
  },
  {
    ...pdfBase,
    slug: "dividir-pdf",
    route: "/pdf/dividir-pdf",
    title: "Dividir PDF",
    h1: "Dividir PDF online",
    group: "Organizar",
    description: "Selecciona visualmente las paginas que quieres extraer.",
    keywords: ["dividir pdf", "extraer paginas pdf", "separar pdf"],
    status: "Disponible",
    processing: "client",
    input: "single-file",
    output: "pdf"
  },
  {
    ...pdfBase,
    slug: "comprimir-pdf",
    route: "/pdf/comprimir-pdf",
    title: "Comprimir PDF",
    h1: "Comprimir PDF online",
    group: "Organizar",
    description: "Reduce y re-guarda el PDF con varias opciones de compresion.",
    keywords: ["comprimir pdf", "reducir pdf"],
    status: "Disponible",
    processing: "client",
    input: "single-file",
    output: "pdf"
  },
  {
    ...pdfBase,
    slug: "rotar-pdf",
    route: "/pdf/rotar-pdf",
    title: "Rotar PDF",
    h1: "Rotar PDF online",
    group: "Organizar",
    description: "Rota todas las paginas o elige paginas individuales.",
    keywords: ["rotar pdf", "girar pdf"],
    status: "Disponible",
    processing: "client",
    input: "single-file",
    output: "pdf"
  },
  {
    ...pdfBase,
    slug: "ordenar-pdf",
    route: "/pdf/ordenar-pdf",
    title: "Ordenar PDF",
    h1: "Ordenar paginas PDF",
    group: "Organizar",
    description: "Arrastra paginas visualmente para cambiar el orden.",
    keywords: ["ordenar pdf", "reorganizar pdf"],
    status: "Disponible",
    processing: "client",
    input: "single-file",
    output: "pdf"
  },
  {
    ...pdfBase,
    slug: "word-a-pdf",
    legacySlug: "word-pdf",
    route: "/pdf/word-a-pdf",
    title: "Word a PDF",
    h1: "Convertir Word a PDF",
    group: "Convertir",
    description: "Convierte DOCX a PDF. Requiere backend para mantener formato real.",
    keywords: ["word a pdf", "docx a pdf"],
    status: "Requiere backend",
    processing: "backend-required",
    input: "office-file",
    output: "pdf"
  },
  {
    ...pdfBase,
    slug: "powerpoint-a-pdf",
    legacySlug: "powerpoint-pdf",
    route: "/pdf/powerpoint-a-pdf",
    title: "PowerPoint a PDF",
    h1: "Convertir PowerPoint a PDF",
    group: "Convertir",
    description: "Convierte PPTX a PDF. Requiere backend para formato fiel.",
    keywords: ["powerpoint a pdf", "pptx a pdf"],
    status: "Requiere backend",
    processing: "backend-required",
    input: "office-file",
    output: "pdf"
  },
  {
    ...pdfBase,
    slug: "excel-a-pdf",
    legacySlug: "excel-pdf",
    route: "/pdf/excel-a-pdf",
    title: "Excel a PDF",
    h1: "Convertir Excel a PDF",
    group: "Convertir",
    description: "Convierte XLSX a PDF. Requiere backend para paginado real.",
    keywords: ["excel a pdf", "xlsx a pdf"],
    status: "Requiere backend",
    processing: "backend-required",
    input: "office-file",
    output: "pdf"
  },
  {
    ...pdfBase,
    slug: "pdf-a-jpg",
    legacySlug: "pdf-jpg",
    route: "/pdf/pdf-a-jpg",
    title: "PDF a imagen",
    h1: "Convertir PDF a imagen",
    group: "Convertir",
    description: "Renderiza paginas PDF como imagenes JPG, PNG o WebP.",
    keywords: ["pdf a imagen", "pdf a jpg", "pdf a png", "pdf a webp"],
    status: "Disponible",
    processing: "client",
    input: "single-file",
    output: "jpg"
  },
  {
    ...pdfBase,
    slug: "jpg-a-pdf",
    legacySlug: "jpg-pdf",
    route: "/pdf/jpg-a-pdf",
    title: "Imagen a PDF",
    h1: "Convertir imagen a PDF",
    group: "Convertir",
    description: "Ordena imagenes JPG, PNG, WebP u otros formatos y conviertelas en un PDF.",
    keywords: ["imagen a pdf", "jpg a pdf", "png a pdf", "webp a pdf"],
    status: "Disponible",
    processing: "client",
    input: "multi-file",
    output: "pdf"
  },
  {
    ...pdfBase,
    slug: "html-a-pdf",
    legacySlug: "html-pdf",
    route: "/pdf/html-a-pdf",
    title: "URL a PDF",
    h1: "Convertir URL a PDF",
    group: "Convertir",
    description: "Introduce un enlace y descarga el contenido principal de la web en PDF.",
    keywords: ["url a pdf", "web a pdf", "pagina web a pdf"],
    status: "Disponible",
    processing: "client",
    input: "html",
    output: "pdf"
  },
  {
    ...pdfBase,
    slug: "firmar-pdf",
    route: "/pdf/firmar-pdf",
    title: "Firmar PDF",
    h1: "Firmar PDF online",
    group: "Firmar",
    description: "Dibuja una o varias firmas y arrastralas visualmente sobre el PDF.",
    keywords: ["firmar pdf", "firma digital pdf"],
    status: "Disponible",
    processing: "client",
    input: "single-file",
    output: "pdf"
  },
  {
    ...converterBase,
    slug: "divisa",
    route: "/conversor/divisa",
    title: "Conversor de divisa",
    h1: "Conversor de divisa online",
    group: "Dinero y tiempo",
    description: "Convierte importes entre EUR, USD, GBP, CHF, JPY y otras divisas habituales.",
    keywords: ["conversor divisa", "convertir moneda", "eur usd"]
  },
  {
    ...converterBase,
    slug: "longitud",
    route: "/conversor/longitud",
    title: "Unidades de longitud",
    h1: "Conversor de longitud",
    group: "Medidas",
    description: "Convierte metros, kilometros, centimetros, millas, yardas, pies y pulgadas.",
    keywords: ["conversor longitud", "metros a pies", "km a millas"]
  },
  {
    ...converterBase,
    slug: "hora",
    route: "/conversor/hora",
    title: "Conversor de hora",
    h1: "Conversor de hora online",
    group: "Dinero y tiempo",
    description: "Convierte segundos, minutos, horas, dias, semanas, meses y anos.",
    keywords: ["conversor hora", "minutos a horas", "segundos a horas"]
  },
  {
    ...converterBase,
    slug: "hora-mundial",
    route: "/conversor/hora-mundial",
    title: "Hora mundial",
    h1: "Hora local por pais",
    group: "Dinero y tiempo",
    description: "Consulta tu hora local y busca la hora actual en paises, ciudades y zonas horarias.",
    keywords: ["hora mundial", "hora local", "hora por pais", "zonas horarias"]
  },
  {
    ...converterBase,
    slug: "temperatura",
    route: "/conversor/temperatura",
    title: "Temperatura",
    h1: "Conversor de temperatura",
    group: "Ciencia",
    description: "Convierte Celsius, Fahrenheit y Kelvin con calculo instantaneo.",
    keywords: ["conversor temperatura", "celsius fahrenheit", "kelvin"]
  },
  {
    ...converterBase,
    slug: "peso",
    route: "/conversor/peso",
    title: "Peso y masa",
    h1: "Conversor de peso",
    group: "Medidas",
    description: "Convierte kilogramos, gramos, toneladas, libras, onzas y stones.",
    keywords: ["conversor peso", "kg a libras", "gramos a onzas"]
  },
  {
    ...converterBase,
    slug: "datos-digitales",
    route: "/conversor/datos-digitales",
    title: "Datos digitales",
    h1: "Conversor de datos digitales",
    group: "Digital",
    description: "Convierte bytes, KB, MB, GB, TB y unidades binarias como KiB, MiB y GiB.",
    keywords: ["conversor datos", "mb a gb", "bytes a megabytes"]
  },
  {
    ...converterBase,
    slug: "capacidad",
    route: "/conversor/capacidad",
    title: "ml, l y capacidad",
    h1: "Conversor de ml, litros y capacidad",
    group: "Medidas",
    description: "Convierte mililitros, litros, metros cubicos, galones, pintas, tazas y onzas liquidas.",
    keywords: ["ml a litros", "litros a galones", "conversor capacidad"]
  },
  {
    ...converterBase,
    slug: "area",
    route: "/conversor/area",
    title: "Area",
    h1: "Conversor de area",
    group: "Superficies",
    description: "Convierte metros cuadrados, hectareas, kilometros cuadrados, pies cuadrados y acres.",
    keywords: ["conversor area", "m2 a hectareas", "pies cuadrados"]
  },
  {
    ...converterBase,
    slug: "volumen",
    route: "/conversor/volumen",
    title: "Volumen",
    h1: "Conversor de volumen",
    group: "Superficies",
    description: "Convierte metros cubicos, centimetros cubicos, litros, pies cubicos y pulgadas cubicas.",
    keywords: ["conversor volumen", "m3 a litros", "pies cubicos"]
  },
  {
    ...converterBase,
    slug: "energia",
    route: "/conversor/energia",
    title: "Energia",
    h1: "Conversor de energia",
    group: "Ciencia",
    description: "Convierte julios, kilojulios, calorias, kilocalorias, Wh, kWh y BTU.",
    keywords: ["conversor energia", "julios a calorias", "kwh a joules"]
  },
  {
    ...audioBase,
    slug: "editor-audio",
    route: "/audio/editor-audio",
    title: "Editor de audio",
    h1: "Editor de audio online",
    group: "Edicion",
    description: "Corta MP3, WAV y otros audios, une varios archivos, aplica fade in/out, cambia velocidad, elimina silencios y exporta WAV.",
    keywords: ["editor de audio", "cortar audio", "trim audio", "unir audios", "fade audio", "cambiar velocidad audio"]
  },
  {
    ...audioBase,
    slug: "mejorar-convertir-audio",
    route: "/audio/mejorar-convertir-audio",
    title: "Mejorar y convertir audio",
    h1: "Mejorar y convertir audio online",
    group: "Mejora y conversion",
    description: "Convierte audio a WAV, ajusta sample rate, normaliza volumen, comprime dinamica, convierte estereo a mono, separa canales y reduce ruido basico.",
    keywords: ["convertidor audio", "mp3 a wav", "mejorar audio", "remove noise audio", "audio compressor", "sample rate converter", "stereo to mono"]
  },
  {
    ...videoBase,
    slug: "editor-video",
    route: "/video/editor-video",
    title: "Video Studio",
    h1: "Video Studio online",
    group: "Todo en uno",
    description: "Edita videos con modos simples para comprimir, convertir, cortar, unir, redimensionar, cambiar velocidad, capturar frames y exportar WebM o MP4 compatible.",
    keywords: ["editor de video online", "video studio", "comprimir video", "convertir video", "cortar video", "unir videos", "redimensionar video", "exportar mp4"]
  },
  {
    ...videoBase,
    slug: "comprimir-video",
    route: "/video/comprimir-video",
    title: "Comprimir video",
    h1: "Comprimir video online",
    group: "Compresion",
    description: "Reduce el tamano de videos MP4, MOV o WebM ajustando calidad, resolucion y compresion desde el navegador.",
    keywords: ["comprimir video", "compress video", "comprimir mp4", "reducir video", "video para whatsapp", "video para email"]
  },
  {
    ...videoBase,
    slug: "convertidor-video",
    route: "/video/convertidor-video",
    title: "Convertidor de video",
    h1: "Convertidor de video online",
    group: "Conversion",
    description: "Convierte videos entre formatos compatibles del navegador, con salida WebM o MP4 cuando el navegador lo soporte.",
    keywords: ["convertidor video", "convertir video", "mp4 converter", "mov a mp4", "webm a mp4", "mp4 a webm"]
  },
  {
    ...videoBase,
    slug: "cortar-video",
    route: "/video/cortar-video",
    title: "Cortar video",
    h1: "Cortar video online",
    group: "Edicion",
    description: "Recorta el inicio y final de un video, divide clips desde el timeline y exporta solo la parte seleccionada.",
    keywords: ["cortar video", "trim video", "recortar video", "dividir video", "split video"]
  },
  {
    ...videoBase,
    slug: "redimensionar-video",
    route: "/video/redimensionar-video",
    title: "Redimensionar video",
    h1: "Redimensionar video online",
    group: "Formato",
    description: "Cambia el formato y resolucion de un video para 16:9, 9:16, 1:1, 720p o 1080p.",
    keywords: ["redimensionar video", "resize video", "crop video", "video 9:16", "video 1:1", "video para tiktok", "video para instagram"]
  },
  {
    ...videoBase,
    slug: "cambiar-velocidad-video",
    route: "/video/cambiar-velocidad-video",
    title: "Cambiar velocidad de video",
    h1: "Cambiar velocidad de video online",
    group: "Edicion",
    description: "Acelera o ralentiza videos entre 0.5x y 2x y exporta el resultado desde el navegador.",
    keywords: ["cambiar velocidad video", "speed up video", "slow motion video", "acelerar video", "ralentizar video"]
  },
  {
    ...videoBase,
    slug: "unir-videos",
    route: "/video/unir-videos",
    title: "Unir videos",
    h1: "Unir videos online",
    group: "Edicion",
    description: "Sube varios videos, ordenalos en el timeline y exportalos como un unico archivo.",
    keywords: ["unir videos", "merge videos", "juntar videos", "combinar videos", "timeline video"]
  }
];

export const featuredTools = tools.slice(0, 6);

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getTool(categorySlug: string, toolSlug?: string) {
  if (!toolSlug) return tools.find((tool) => tool.slug === categorySlug || tool.legacySlug === categorySlug);
  return tools.find((tool) => tool.categorySlug === categorySlug && tool.slug === toolSlug);
}

export function getToolByLegacySlug(slug: string) {
  return tools.find((tool) => tool.legacySlug === slug || tool.slug === slug);
}

export function getToolsByCategory(slug: string) {
  return tools.filter((tool) => tool.categorySlug === slug);
}

export function getRelatedTools(tool: Tool, limit = 6) {
  return tools
    .filter((item) => item.route !== tool.route)
    .sort((left, right) => Number(right.categorySlug === tool.categorySlug) - Number(left.categorySlug === tool.categorySlug))
    .slice(0, limit);
}

export function groupToolsByLabel(categoryTools: Tool[]) {
  const groups = new Map<string, Tool[]>();
  categoryTools.forEach((tool) => {
    const group = groups.get(tool.group) ?? [];
    group.push(tool);
    groups.set(tool.group, group);
  });
  return Array.from(groups, ([title, groupedTools]) => ({ title, tools: groupedTools }));
}
