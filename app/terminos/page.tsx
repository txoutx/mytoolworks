import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Terminos de uso",
  description: "Condiciones de uso de las herramientas online de MyToolWorks.",
  alternates: { canonical: "/terminos" }
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terminos de uso"
      description="Condiciones basicas para usar las herramientas de MyToolWorks de forma responsable."
    >
      <p>Ultima actualizacion: 11 de junio de 2026.</p>
      <h2>Uso permitido</h2>
      <p>
        Puedes usar MyToolWorks para procesar documentos propios o documentos sobre los que tengas permiso. No debes
        subir archivos ilegales, maliciosos, confidenciales sin autorizacion o que vulneren derechos de terceros.
      </p>
      <h2>Resultados</h2>
      <p>
        Intentamos que las herramientas sean utiles y precisas, pero no podemos garantizar que todos los archivos se
        procesen perfectamente. Revisa siempre el resultado antes de usarlo en procesos importantes.
      </p>
      <h2>Disponibilidad</h2>
      <p>
        El servicio puede cambiar, mejorar o estar temporalmente no disponible por mantenimiento, limites tecnicos o
        incidencias externas.
      </p>
      <h2>Responsabilidad del usuario</h2>
      <p>
        El usuario es responsable del contenido que sube y del uso posterior de los documentos generados o modificados.
      </p>
    </LegalPage>
  );
}
