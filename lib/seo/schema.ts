import type { SeoArticle, SeoFaq, UseCasePage } from "./types";

const baseUrl = "https://mytoolworks.com";

export function faqSchema(faqs: SeoFaq[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function articleSchema(article: SeoArticle, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.h1,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    inLanguage: article.locale,
    author: {
      "@type": "Organization",
      name: "MyToolWorks",
      url: `${baseUrl}/sobre-mytoolworks`
    },
    publisher: {
      "@type": "Organization",
      name: "MyToolWorks",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/favicon-192x192.png`
      }
    },
    mainEntityOfPage: `${baseUrl}${path}`
  };
}

export function useCaseSchema(page: UseCasePage, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: page.h1,
    description: page.description,
    inLanguage: page.locale,
    dateModified: page.dateModified,
    mainEntityOfPage: `${baseUrl}${path}`,
    step: page.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step,
      text: step
    }))
  };
}

export function breadcrumbSchema(items: Array<{ name: string; href: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.href}`
    }))
  };
}
