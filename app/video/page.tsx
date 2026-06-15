import { CategoryListing, categoryMetadata } from "../components/CategoryListing";

const description =
  "Editor de video online con timeline visual para cortar, unir, recortar, rotar, ajustar velocidad, volumen, capturar frames y exportar.";

export const metadata = categoryMetadata("Herramientas de video", description, "video");

export default function VideoPage() {
  return <CategoryListing slug="video" title="Herramientas de video" description={description} locale="es" />;
}
