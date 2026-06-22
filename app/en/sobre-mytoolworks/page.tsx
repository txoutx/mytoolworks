import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "About MyToolWorks",
  description: "Learn how MyToolWorks tools and guides are created, tested and maintained.",
  alternates: {
    canonical: "/en/sobre-mytoolworks",
    languages: {
      es: "/sobre-mytoolworks",
      en: "/en/sobre-mytoolworks"
    }
  }
};

export default function EnglishAboutPage() {
  return (
    <LegalPage
      eyebrow="MyToolWorks"
      title="About MyToolWorks"
      description="Online tools built to solve specific tasks clearly, quickly and responsibly."
      locale="en"
    >
      <h2>What MyToolWorks is</h2>
      <p>
        MyToolWorks is an independent collection of online tools for PDF, image, audio, video and everyday conversions.
        Each page is expected to do what it promises, explain technical limits and let users check the result before
        downloading whenever browser technology allows it.
      </p>
      <h2>How tools are tested</h2>
      <p>
        Tools are checked with different file sizes and formats on desktop and mobile. The main workflow, error messages,
        downloads and real browser compatibility are reviewed before a feature is presented as available. Server-only
        conversions must be identified clearly instead of being shown as completed browser operations.
      </p>
      <h2>Original editorial content</h2>
      <p>
        Guides and use cases explain practical jobs that can be completed with the site tools. They include steps,
        recommendations, technical limits, frequently asked questions and links to the relevant utility. Pages are not
        published only to repeat keywords.
      </p>
      <h2>Privacy and advertising</h2>
      <p>
        Files are processed locally whenever practical. Advertising supports maintenance, but it is limited to editorial
        pages with substantial content and follows the consent choices made by the user.
      </p>
      <h2>Contact</h2>
      <p>
        Report an issue or suggest an improvement at
        {" "}<a href="mailto:contacto@mytoolworks.com">contacto@mytoolworks.com</a>.
      </p>
    </LegalPage>
  );
}
