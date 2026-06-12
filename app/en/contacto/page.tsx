import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact MyToolWorks for support, privacy requests or suggestions.",
  alternates: { canonical: "/en/contacto" }
};

export default function EnglishContactPage() {
  return (
    <LegalPage eyebrow="Contact" title="Contact" description="Write to us about tools, privacy, ads or improvements." locale="en">
      <h2>Email</h2>
      <p>
        You can contact MyToolWorks at <a href="mailto:contacto@mytoolworks.com">contacto@mytoolworks.com</a>.
      </p>
      <h2>Common topics</h2>
      <ul>
        <li>Problems processing a PDF or downloading a result.</li>
        <li>Privacy or data deletion requests.</li>
        <li>Suggestions for new tools or interface improvements.</li>
        <li>Advertising and collaboration questions.</li>
      </ul>
    </LegalPage>
  );
}
