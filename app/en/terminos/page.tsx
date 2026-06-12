import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for MyToolWorks online tools.",
  alternates: { canonical: "/en/terminos" }
};

export default function EnglishTermsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms" description="Basic conditions for using MyToolWorks responsibly." locale="en">
      <h2>Use of the service</h2>
      <p>You may use MyToolWorks to process your own documents or documents you are allowed to handle.</p>
      <h2>Responsibility</h2>
      <p>You are responsible for the files you upload and for verifying the result before using it professionally or legally.</p>
      <h2>Availability</h2>
      <p>The service may change, fail or be interrupted while tools are improved.</p>
    </LegalPage>
  );
}
