import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Sobre MyToolWorks",
  description: "Conoce como se crean, prueban y mantienen las herramientas y guias de MyToolWorks.",
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
      <h2>Contenido editorial original</h2>
      <p>
        Las guias y casos de uso se redactan para explicar tareas concretas que tambien pueden resolverse con las
        herramientas de la web. El contenido incluye pasos, recomendaciones, limites tecnicos, preguntas frecuentes y
        enlaces directos a la utilidad adecuada. No se publican paginas generadas solo para repetir palabras clave.
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
        MyToolWorks limita la carga publicitaria a paginas editoriales con contenido suficiente y respeta las preferencias
        de consentimiento configuradas por el usuario.
      </p>
      <h2>Contacto</h2>
      <p>
        Para comunicar un error, sugerir una mejora o plantear una consulta puedes escribir a
        {" "}<a href="mailto:contacto@mytoolworks.com">contacto@mytoolworks.com</a>.
      </p>
    </LegalPage>
  );
}
