import type { MetadataRoute } from "next";
import { categories, tools } from "./data/tools";
import { withLocalePath } from "../lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mytoolworks.com";
  const legalRoutes = ["/politica-privacidad", "/cookies", "/terminos", "/contacto"];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    ...categories.map((category) => ({
      url: `${baseUrl}/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.95
    })),
    ...categories.map((category) => ({
      url: `${baseUrl}${withLocalePath(`/${category.slug}`, "en")}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.95
    })),
    ...tools.map((tool) => ({
      url: `${baseUrl}${tool.route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: tool.status === "Disponible" ? 0.9 : 0.75
    })),
    ...tools.map((tool) => ({
      url: `${baseUrl}${withLocalePath(tool.route, "en")}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: tool.status === "Disponible" ? 0.9 : 0.75
    })),
    ...legalRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.35
    })),
    ...legalRoutes.map((route) => ({
      url: `${baseUrl}${withLocalePath(route, "en")}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.35
    }))
  ];
}
