export type ToolCategorySlug = "pdf";

export type ToolKind =
  | "pdf"
  | "mortgage"
  | "salary"
  | "units"
  | "scientific"
  | "cv"
  | "letter"
  | "summary"
  | "grammar";

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
  output: "pdf" | "docx" | "pptx" | "xlsx" | "jpg" | "text" | "calculation";
  adProfile: AdProfile;
};

export const categories: ToolCategory[] = [
  {
    slug: "pdf",
    title: "Herramientas PDF",
    shortTitle: "PDF",
    navLabel: "PDF",
    description: "Unir, dividir, comprimir, rotar, ordenar, convertir y firmar PDF."
  }
];

const pdfBase = {
  categorySlug: "pdf" as const,
  kind: "pdf" as const,
  adProfile: "standard" as const
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
    slug: "pdf-a-word",
    legacySlug: "pdf-word",
    route: "/pdf/pdf-a-word",
    title: "PDF a Word",
    h1: "Convertir PDF a Word",
    group: "Convertir",
    description: "Extrae texto seleccionable de un PDF y lo descarga como DOCX.",
    keywords: ["pdf a word", "pdf a docx"],
    status: "Disponible",
    processing: "client",
    input: "single-file",
    output: "docx"
  },
  {
    ...pdfBase,
    slug: "pdf-a-powerpoint",
    legacySlug: "pdf-powerpoint",
    route: "/pdf/pdf-a-powerpoint",
    title: "PDF a PowerPoint",
    h1: "Convertir PDF a PowerPoint",
    group: "Convertir",
    description: "Convierte cada pagina PDF en una diapositiva visual.",
    keywords: ["pdf a powerpoint", "pdf a pptx"],
    status: "Disponible",
    processing: "client",
    input: "single-file",
    output: "pptx"
  },
  {
    ...pdfBase,
    slug: "pdf-a-excel",
    legacySlug: "pdf-excel",
    route: "/pdf/pdf-a-excel",
    title: "PDF a Excel",
    h1: "Convertir PDF a Excel",
    group: "Convertir",
    description: "Extrae texto seleccionable del PDF a una hoja Excel.",
    keywords: ["pdf a excel", "pdf a xlsx"],
    status: "Disponible",
    processing: "client",
    input: "single-file",
    output: "xlsx"
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
    description: "Dibuja tu firma, elige posicion visual y prepara opcion de certificado.",
    keywords: ["firmar pdf", "firma digital pdf"],
    status: "Disponible",
    processing: "client",
    input: "single-file",
    output: "pdf"
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
  return tools.filter((item) => item.route !== tool.route).slice(0, limit);
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
