import type { Locale } from "../i18n";
import { localizeTool, withLocalePath } from "../i18n";
import { getToolByLegacySlug, tools, type ToolCategorySlug } from "../tools/registry";
import { getArticles } from "./blog";
import { getUseCases } from "./useCases";
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

export function getSeoLinksForTool(toolSlug: string, locale: Locale) {
  const articles = getArticles(locale)
    .filter((article) => article.relatedTools.includes(toolSlug))
    .slice(0, 3)
    .map((article) => ({
      title: article.title,
      href: withLocalePath(`/blog/${article.slug}`, locale),
      description: article.description
    }));
  const cases = getUseCases(locale)
    .filter((item) => item.primaryTool === toolSlug || item.relatedTools.includes(toolSlug))
    .slice(0, 3)
    .map((item) => ({
      title: item.title,
      href: locale === "en" ? `/en/use-cases/${item.slug}` : `/casos/${item.slug}`,
      description: item.description
    }));
  return { articles, cases };
}

export function getSeoLinksForCategory(category: string, locale: Locale) {
  const typedCategory = category as ToolCategorySlug;
  const articles = getArticles(locale)
    .filter((article) => article.category === typedCategory)
    .slice(0, 4)
    .map((article) => ({
      title: article.title,
      href: withLocalePath(`/blog/${article.slug}`, locale),
      description: article.description
    }));
  const cases = getUseCases(locale)
    .filter((item) => item.category === typedCategory)
    .slice(0, 4)
    .map((item) => ({
      title: item.title,
      href: locale === "en" ? `/en/use-cases/${item.slug}` : `/casos/${item.slug}`,
      description: item.description
    }));
  return [...articles, ...cases].slice(0, 6);
}
