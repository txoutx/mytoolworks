import { CategoryListing, categoryMetadata } from "../components/CategoryListing";

const description =
  "Editor de video online con timeline visual para cortar, unir, recortar, rotar, ajustar velocidad, volumen, capturar frames y exportar.";

export const metadata = categoryMetadata("Video", description, "video");

export default function VideoPage() {
  return <CategoryListing slug="video" title="Video" description={description} locale="es" />;
}
