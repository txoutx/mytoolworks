import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "Information about privacy, files, data and advertising on MyToolWorks.",
  alternates: { canonical: "/en/politica-privacidad" }
};

export default function EnglishPrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy policy" description="How MyToolWorks may process data and use it to provide the service." locale="en">
      <p>Last updated: June 11, 2026.</p>
      <h2>Controller</h2>
      <p>MyToolWorks is an online tools website available at mytoolworks.com. For privacy questions, use the contact page.</p>
      <h2>Data we process</h2>
      <p>We may process basic technical data such as IP address, browser, device, visited pages and usage events for security, analytics and service improvement.</p>
      <h2>Uploaded files</h2>
      <p>Browser-based tools process files locally. Tools that require a server may use temporary storage to generate the result and remove files when no longer needed.</p>
      <h2>Advertising</h2>
      <p>This website may show ads through Google AdSense or other providers. These services may use cookies or identifiers to measure ads and limit frequency.</p>
    </LegalPage>
  );
}
