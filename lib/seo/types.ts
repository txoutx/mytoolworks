import type { Locale } from "../i18n";
import type { ToolCategorySlug } from "../tools/registry";

export type SeoFaq = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  title: string;
  href: string;
  description?: string;
};

export type SeoArticle = {
  slug: string;
  locale: Locale;
  alternateSlug?: string;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  category: ToolCategorySlug;
  datePublished: string;
  dateModified: string;
  relatedTools: string[];
  sections: Array<{
    heading: string;
    body: string;
    bullets?: string[];
  }>;
  faq: SeoFaq[];
};

export type UseCasePage = {
  slug: string;
  locale: Locale;
  alternateSlug?: string;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  category: ToolCategorySlug;
  dateModified: string;
  primaryTool: string;
  relatedTools: string[];
  steps: string[];
  sections: Array<{
    heading: string;
    body: string;
  }>;
  faq: SeoFaq[];
};
