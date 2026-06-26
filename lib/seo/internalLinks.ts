import type { Locale } from "../i18n";
import { localizeTool, withLocalePath } from "../i18n";
import { getToolByLegacySlug, tools } from "../tools/registry";
import type { RelatedLink } from "./types";

export function toolPathFromSlug(slug: string, locale: Locale) {
  if (slug === "img") return withLocalePath("/img", locale);
  const tool = getToolByLegacySlug(slug);
  return tool ? localizeTool(tool, locale).route : withLocalePath("/", locale);
}

export function getToolLinks(slugs: string[], locale: Locale): RelatedLink[] {
  return slugs.map((slug) => {
    if (slug === "img") {
      return {
        title: locale === "en" ? "Image tools" : "Herramientas de imagen",
        href: withLocalePath("/img", locale),
        description: locale === "en" ? "Resize, convert and optimize images." : "Redimensiona, convierte y optimiza imagenes."
      };
    }
    const source = tools.find((tool) => tool.slug === slug || tool.legacySlug === slug);
    const tool = source ? localizeTool(source, locale) : undefined;
    return {
      title: tool?.title ?? slug,
      href: tool?.route ?? withLocalePath("/", locale),
      description: tool?.description
    };
  });
}
