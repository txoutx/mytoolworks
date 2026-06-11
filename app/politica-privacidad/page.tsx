import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Politica de privacidad",
  description: "Informacion sobre privacidad, archivos, datos y publicidad en MyToolWorks.",
  alternates: { canonical: "/politica-privacidad" }
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Politica de privacidad"
      description="Explicamos que datos puede tratar MyToolWorks y como se usan para prestar el servicio."
    >
      <p>Ultima actualizacion: 11 de junio de 2026.</p>
      <h2>Responsable</h2>
      <p>
        MyToolWorks es una web de herramientas online accesible desde mytoolworks.com. Para consultas de privacidad,
        puedes escribir desde la pagina de contacto.
      </p>
      <h2>Datos que tratamos</h2>
      <p>
        Podemos tratar datos tecnicos basicos, como direccion IP, navegador, dispositivo, paginas visitadas y eventos
        de uso necesarios para seguridad, analitica y mejora del servicio. Cuando subes archivos, se usan solo para
        ejecutar la herramienta solicitada.
      </p>
      <h2>Archivos subidos</h2>
      <p>
        Las herramientas que funcionan en el navegador procesan el archivo localmente. Las herramientas que requieren
        servidor podran usar almacenamiento temporal para generar el resultado, con eliminacion automatica cuando ya no
        sea necesario.
      </p>
      <h2>Publicidad</h2>
      <p>
        Esta web puede mostrar anuncios mediante Google AdSense u otros proveedores. Estos servicios pueden usar cookies
        o identificadores para medir anuncios, limitar frecuencia y ofrecer publicidad personalizada o no personalizada.
      </p>
      <h2>Derechos</h2>
      <p>
        Puedes solicitar informacion, acceso, rectificacion o eliminacion de datos escribiendo desde contacto. Tambien
        puedes gestionar cookies desde la configuracion de tu navegador.
      </p>
    </LegalPage>
  );
}
