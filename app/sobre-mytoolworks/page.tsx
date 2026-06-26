import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Sobre MyToolWorks",
  description: "Conoce como se crean, prueban y mantienen las herramientas de MyToolWorks.",
  alternates: {
    canonical: "/sobre-mytoolworks",
    languages: {
      es: "/sobre-mytoolworks",
      en: "/en/sobre-mytoolworks"
    }
  }
};

export default function AboutPage() {
  return (
    <LegalPage
      eyebrow="MyToolWorks"
      title="Sobre MyToolWorks"
      description="Herramientas online creadas para resolver tareas concretas de forma clara, rapida y responsable."
    >
      <h2>Que es MyToolWorks</h2>
      <p>
        MyToolWorks es un proyecto independiente de herramientas online para trabajar con PDF, imagen, audio, video y
        conversiones habituales. La prioridad es que cada pagina haga exactamente lo que anuncia, explique sus limites y
        permita comprobar el resultado antes de descargarlo siempre que la tecnologia del navegador lo permita.
      </p>
      <h2>Como se crean y prueban las herramientas</h2>
      <p>
        Cada herramienta se prueba con archivos de distintos tamanos y formatos, tanto en escritorio como en movil. Antes
        de publicar una funcion se revisan el flujo principal, los mensajes de error, la descarga y la compatibilidad real
        del navegador. Si una conversion necesita un servidor especializado, la pagina debe indicarlo y no presentar una
        simulacion como si fuera un resultado terminado.
      </p>
      <h2>Contenido de cada herramienta</h2>
      <p>
        Cada herramienta incluye una explicacion breve de lo que hace, pasos de uso, limites tecnicos y preguntas
        frecuentes cuando aportan valor. No se publican paginas separadas solo para repetir palabras clave.
      </p>
      <h2>Privacidad y procesamiento</h2>
      <p>
        Siempre que es viable, los archivos se procesan localmente en el navegador. Esto reduce subidas innecesarias y
        mejora la privacidad. Las paginas explican cuando una funcion requiere backend, almacenamiento temporal o un
        codificador que el navegador no ofrece.
      </p>
      <h2>Publicidad y sostenibilidad</h2>
      <p>
        La publicidad ayuda a mantener el proyecto, pero no debe sustituir al contenido ni interferir con la herramienta.
        MyToolWorks no carga anuncios en pantallas de edicion o paginas sin suficiente contenido propio y respeta las
        preferencias de consentimiento configuradas por el usuario.
      </p>
      <h2>Contacto</h2>
      <p>
        Para comunicar un error, sugerir una mejora o plantear una consulta puedes escribir a
        {" "}<a href="mailto:contacto@mytoolworks.com">contacto@mytoolworks.com</a>.
      </p>
    </LegalPage>
  );
}
