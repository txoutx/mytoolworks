import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta con MyToolWorks para soporte, privacidad o sugerencias.",
  alternates: { canonical: "/contacto" }
};

export default function ContactPage() {
  return (
    <LegalPage
      eyebrow="Contacto"
      title="Contacto"
      description="Escribenos para dudas sobre herramientas, privacidad, publicidad o mejoras."
    >
      <h2>Correo</h2>
      <p>
        Puedes contactar con MyToolWorks en <a href="mailto:contacto@mytoolworks.com">contacto@mytoolworks.com</a>.
      </p>
      <h2>Consultas habituales</h2>
      <ul>
        <li>Problemas al procesar un PDF o descargar un resultado.</li>
        <li>Solicitudes relacionadas con privacidad o eliminacion de datos.</li>
        <li>Sugerencias para nuevas herramientas o mejoras de interfaz.</li>
        <li>Consultas sobre publicidad y colaboraciones.</li>
      </ul>
    </LegalPage>
  );
}
