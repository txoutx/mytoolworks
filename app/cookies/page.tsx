import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Politica de cookies",
  description: "Uso de cookies tecnicas, analiticas y publicitarias en MyToolWorks.",
  alternates: { canonical: "/cookies" }
};

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Politica de cookies"
      description="Informacion clara sobre las cookies que pueden utilizarse en la web."
    >
      <p>Ultima actualizacion: 11 de junio de 2026.</p>
      <h2>Que son las cookies</h2>
      <p>
        Las cookies son pequenos archivos que el navegador guarda para recordar preferencias, medir uso o permitir que
        servicios externos funcionen correctamente.
      </p>
      <h2>Tipos de cookies</h2>
      <ul>
        <li>Cookies tecnicas: necesarias para que la web cargue y funcione correctamente.</li>
        <li>Cookies analiticas: ayudan a entender que herramientas se usan y como mejorar la experiencia.</li>
        <li>Cookies publicitarias: pueden utilizarse para mostrar anuncios y medir su rendimiento.</li>
      </ul>
      <h2>Google AdSense</h2>
      <p>
        Google puede usar cookies para mostrar anuncios, medir impresiones y prevenir fraude. Puedes consultar y cambiar
        preferencias publicitarias desde las opciones de tu cuenta de Google y desde el navegador.
      </p>
      <h2>Como desactivar cookies</h2>
      <p>
        Puedes bloquear o eliminar cookies desde la configuracion de Chrome, Firefox, Edge, Safari u otro navegador. Si
        bloqueas algunas cookies, ciertas funciones externas podrian no comportarse igual.
      </p>
    </LegalPage>
  );
}
