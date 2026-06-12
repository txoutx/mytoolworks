import type { Tool, ToolCategory } from "./tools/registry";

export type Locale = "es" | "en";

export const defaultLocale: Locale = "es";
export const locales: Locale[] = ["es", "en"];

export function withLocalePath(path: string, locale: Locale) {
  if (locale === "es") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

export function isLocale(value: string): value is Locale {
  return value === "es" || value === "en";
}

export const ui = {
  es: {
    navPdf: "PDF",
    navImage: "Imagen",
    navConverter: "Conversores",
    footerTagline: "Herramientas online rapidas y limpias. Hecho por txoutx.",
    privacy: "Privacidad",
    cookies: "Cookies",
    terms: "Terminos",
    contact: "Contacto",
    ad: "Publicidad",
    category: "Categoria",
    openTool: "Abrir herramienta",
    lowerAd: "Anuncio inferior",
    topAd: "Anuncio superior",
    resultAd: "Anuncio despues del resultado",
    sideAd: "Anuncio lateral",
    related: "Relacionadas",
    homeEyebrow: "Herramientas online",
    homeLead: "Elige una categoria y trabaja con PDFs, imagenes o conversores directamente desde el navegador.",
    homePdfDescription: "Une, divide, comprime, rota, ordena, convierte a imagen y firma archivos PDF.",
    homeImageTitle: "Imagen",
    homeImageDescription: "Edita imagenes, crea collages, cambia el lienzo, convierte formatos y descarga el resultado.",
    homeConverterTitle: "Conversores",
    homeConverterDescription: "Convierte divisas, unidades, horas, temperatura, peso, datos digitales, area, volumen y energia.",
    openPdf: "Abrir PDF",
    openImage: "Abrir imagen",
    openConverter: "Abrir conversores",
    imageEyebrow: "Imagen",
    imageTitle: "Herramientas de imagen online",
    imageLead: "Edita, combina, comprime, convierte, redimensiona y descarga imagenes directamente desde el navegador."
  },
  en: {
    navPdf: "PDF",
    navImage: "Images",
    navConverter: "Converters",
    footerTagline: "Fast, clean online tools. Made by txoutx.",
    privacy: "Privacy",
    cookies: "Cookies",
    terms: "Terms",
    contact: "Contact",
    ad: "Advertisement",
    category: "Category",
    openTool: "Open tool",
    lowerAd: "Lower ad",
    topAd: "Top ad",
    resultAd: "Ad after result",
    sideAd: "Side ad",
    related: "Related tools",
    homeEyebrow: "Online tools",
    homeLead: "Choose a category and work with PDFs, images or converters directly in your browser.",
    homePdfDescription: "Merge, split, compress, rotate, reorder, convert to images and sign PDF files.",
    homeImageTitle: "Images",
    homeImageDescription: "Edit images, create collages, change the canvas, convert formats and download the result.",
    homeConverterTitle: "Converters",
    homeConverterDescription: "Convert currencies, units, time, temperature, weight, digital data, area, volume and energy.",
    openPdf: "Open PDF",
    openImage: "Open images",
    openConverter: "Open converters",
    imageEyebrow: "Images",
    imageTitle: "Online image tools",
    imageLead: "Edit, combine, compress, convert, resize and download images directly from your browser."
  }
} as const;

const categoryTranslations: Record<Locale, Record<string, Partial<ToolCategory>>> = {
  es: {},
  en: {
    pdf: {
      title: "PDF Tools",
      shortTitle: "PDF",
      navLabel: "PDF",
      description: "Merge, split, compress, rotate, reorder, convert and sign PDF files."
    },
    img: {
      title: "Image tools",
      shortTitle: "Images",
      navLabel: "Images",
      description: "Edit, compress, convert, resize and download images from your browser."
    },
    conversor: {
      title: "Online converters",
      shortTitle: "Converters",
      navLabel: "Converters",
      description: "Convert currencies, units, time, temperature, weight, digital data, area, volume and energy."
    }
  }
};

const toolTranslations: Record<Locale, Record<string, Partial<Tool>>> = {
  es: {},
  en: {
    "unir-pdf": {
      title: "Merge PDF",
      h1: "Merge PDF online",
      group: "Organize",
      description: "Visually order multiple PDFs and merge them into one file.",
      keywords: ["merge pdf", "combine pdf", "join pdf"],
      status: "Disponible"
    },
    "dividir-pdf": {
      title: "Split PDF",
      h1: "Split PDF online",
      group: "Organize",
      description: "Visually select the pages you want to extract.",
      keywords: ["split pdf", "extract pdf pages", "separate pdf"]
    },
    "comprimir-pdf": {
      title: "Compress PDF",
      h1: "Compress PDF online",
      group: "Organize",
      description: "Reduce and re-save your PDF with several compression options.",
      keywords: ["compress pdf", "reduce pdf size"]
    },
    "rotar-pdf": {
      title: "Rotate PDF",
      h1: "Rotate PDF online",
      group: "Organize",
      description: "Rotate all pages or choose individual pages.",
      keywords: ["rotate pdf", "turn pdf pages"]
    },
    "ordenar-pdf": {
      title: "Reorder PDF",
      h1: "Reorder PDF pages",
      group: "Organize",
      description: "Drag pages visually to change their order.",
      keywords: ["reorder pdf", "organize pdf pages"]
    },
    "word-a-pdf": {
      title: "Word to PDF",
      h1: "Convert Word to PDF",
      group: "Convert",
      description: "Convert DOCX to PDF. A backend is required for accurate formatting."
    },
    "powerpoint-a-pdf": {
      title: "PowerPoint to PDF",
      h1: "Convert PowerPoint to PDF",
      group: "Convert",
      description: "Convert PPTX to PDF. A backend is required for faithful formatting."
    },
    "excel-a-pdf": {
      title: "Excel to PDF",
      h1: "Convert Excel to PDF",
      group: "Convert",
      description: "Convert XLSX to PDF. A backend is required for real pagination."
    },
    "pdf-a-jpg": {
      title: "PDF to image",
      h1: "Convert PDF to image",
      group: "Convert",
      description: "Render PDF pages as JPG, PNG or WebP images."
    },
    "jpg-a-pdf": {
      title: "Image to PDF",
      h1: "Convert image to PDF",
      group: "Convert",
      description: "Order JPG, PNG, WebP or other images and convert them into a PDF."
    },
    "html-a-pdf": {
      title: "URL to PDF",
      h1: "Convert URL to PDF",
      group: "Convert",
      description: "Enter a link and download the main web page content as a PDF."
    },
    "firmar-pdf": {
      title: "Sign PDF",
      h1: "Sign PDF online",
      group: "Sign",
      description: "Draw one or more signatures and place them visually on the PDF."
    },
    divisa: {
      title: "Currency converter",
      h1: "Online currency converter",
      group: "Money and time",
      description: "Convert amounts between EUR, USD, GBP, CHF, JPY and other common currencies."
    },
    longitud: {
      title: "Length units",
      h1: "Length converter",
      group: "Measurements",
      description: "Convert meters, kilometers, centimeters, miles, yards, feet and inches."
    },
    hora: {
      title: "Time converter",
      h1: "Online time converter",
      group: "Money and time",
      description: "Convert seconds, minutes, hours, days, weeks, months and years."
    },
    temperatura: {
      title: "Temperature",
      h1: "Temperature converter",
      group: "Science",
      description: "Convert Celsius, Fahrenheit and Kelvin instantly."
    },
    peso: {
      title: "Weight and mass",
      h1: "Weight converter",
      group: "Measurements",
      description: "Convert kilograms, grams, tonnes, pounds, ounces and stones."
    },
    "datos-digitales": {
      title: "Digital data",
      h1: "Digital data converter",
      group: "Digital",
      description: "Convert bytes, KB, MB, GB, TB and binary units such as KiB, MiB and GiB."
    },
    capacidad: {
      title: "ml, l and capacity",
      h1: "ml, liters and capacity converter",
      group: "Measurements",
      description: "Convert milliliters, liters, cubic meters, gallons, pints, cups and fluid ounces."
    },
    area: {
      title: "Area",
      h1: "Area converter",
      group: "Surfaces",
      description: "Convert square meters, hectares, square kilometers, square feet and acres."
    },
    volumen: {
      title: "Volume",
      h1: "Volume converter",
      group: "Surfaces",
      description: "Convert cubic meters, cubic centimeters, liters, cubic feet and cubic inches."
    },
    energia: {
      title: "Energy",
      h1: "Energy converter",
      group: "Science",
      description: "Convert joules, kilojoules, calories, kilocalories, Wh, kWh and BTU."
    }
  }
};

export function localizeCategory(category: ToolCategory, locale: Locale): ToolCategory {
  return { ...category, ...(categoryTranslations[locale][category.slug] ?? {}) };
}

export function localizeTool(tool: Tool, locale: Locale): Tool {
  const translated = toolTranslations[locale][tool.slug] ?? {};
  return {
    ...tool,
    ...translated,
    route: withLocalePath(tool.route, locale)
  };
}
