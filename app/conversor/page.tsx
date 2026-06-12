import { CategoryListing, categoryMetadata } from "../components/CategoryListing";

const description = "Conversores rapidos para divisa, longitud, hora, temperatura, peso, datos digitales, capacidad, area, volumen y energia.";

export const metadata = categoryMetadata("Conversores online", description, "conversor");

export default function ConverterPage() {
  return <CategoryListing slug="conversor" title="Conversores online" description={description} locale="es" />;
}
