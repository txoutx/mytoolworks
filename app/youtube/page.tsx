import { CategoryListing, categoryMetadata } from "../components/CategoryListing";

const description =
  "Herramientas para YouTube: miniaturas, metadatos, estimaciones MP3/MP4, Shorts, playlists, transcripciones y SEO.";

export const metadata = categoryMetadata("Herramientas YouTube", description, "youtube");

export default function YouTubePage() {
  return <CategoryListing slug="youtube" title="Herramientas YouTube" description={description} locale="es" />;
}
