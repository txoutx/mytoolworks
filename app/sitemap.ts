import type { MetadataRoute } from "next";
import { categories, tools } from "./data/tools";
import { withLocalePath } from "../lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mytoolworks.com";
  const legalRoutes = ["/politica-privacidad", "/cookies", "/terminos", "/contacto", "/sobre-mytoolworks"];
  const lastModified = new Date("2026-06-16T00:00:00.000Z");

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${baseUrl}/en`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1
    },
    ...categories.map((category) => ({
      url: `${baseUrl}/${category.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.95
    })),
    ...categories.map((category) => ({
      url: `${baseUrl}${withLocalePath(`/${category.slug}`, "en")}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.95
    })),
    ...tools.filter((tool) => tool.status === "Disponible").map((tool) => ({
      url: `${baseUrl}${tool.route}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: tool.status === "Disponible" ? 0.9 : 0.75
    })),
    ...tools.filter((tool) => tool.status === "Disponible").map((tool) => ({
      url: `${baseUrl}${withLocalePath(tool.route, "en")}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: tool.status === "Disponible" ? 0.9 : 0.75
    })),
    ...legalRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.35
    })),
    ...legalRoutes.map((route) => ({
      url: `${baseUrl}${withLocalePath(route, "en")}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.35
    }))
  ];
}
