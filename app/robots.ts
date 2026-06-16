import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/"
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/favicon.ico", "/favicon-48x48.png", "/favicon-192x192.png"]
      }
    ],
    sitemap: "https://mytoolworks.com/sitemap.xml"
  };
}
