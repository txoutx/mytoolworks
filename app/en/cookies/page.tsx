import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Cookies",
  description: "Cookie information for MyToolWorks.",
  alternates: { canonical: "/en/cookies" }
};

export default function EnglishCookiesPage() {
  return (
    <LegalPage eyebrow="Legal" title="Cookies" description="How cookies may be used on MyToolWorks." locale="en">
      <h2>Cookie use</h2>
      <p>MyToolWorks may use technical, analytics and advertising cookies to operate the site, measure usage and show ads.</p>
      <h2>Managing cookies</h2>
      <p>You can delete or block cookies from your browser settings. Some features may work differently if cookies are blocked.</p>
    </LegalPage>
  );
}
