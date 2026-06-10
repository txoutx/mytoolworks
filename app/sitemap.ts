import type { MetadataRoute } from "next";
import { categories, tools } from "./data/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mytoolworks.com";

  return [
    {
      url: baseUrl,
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
    ...tools.map((tool) => ({
      url: `${baseUrl}${tool.route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: tool.status === "Disponible" ? 0.9 : 0.75
    }))
  ];
}
