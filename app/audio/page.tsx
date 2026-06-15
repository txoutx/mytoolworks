import { CategoryListing, categoryMetadata } from "../components/CategoryListing";

const description =
  "Herramientas de audio para cortar, unir, convertir, comprimir, normalizar, limpiar ruido, ajustar velocidad, sample rate y canales.";

export const metadata = categoryMetadata("Herramientas de audio", description, "audio");

export default function AudioPage() {
  return <CategoryListing slug="audio" title="Herramientas de audio" description={description} locale="es" />;
}
