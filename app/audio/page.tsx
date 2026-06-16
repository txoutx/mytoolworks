import { CategoryListing, categoryMetadata } from "../components/CategoryListing";

const description =
  "Herramientas de audio online para cortar, unir, convertir, comprimir, normalizar, limpiar ruido, ajustar velocidad y canales.";

export const metadata = categoryMetadata("Audio", description, "audio");

export default function AudioPage() {
  return <CategoryListing slug="audio" title="Audio" description={description} locale="es" />;
}
