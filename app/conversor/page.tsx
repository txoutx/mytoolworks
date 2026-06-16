import { CategoryListing, categoryMetadata } from "../components/CategoryListing";

const description = "Conversores online rapidos para divisa, longitud, hora, temperatura, peso, datos digitales, capacidad, area, volumen y energia.";

export const metadata = categoryMetadata("Conversores", description, "conversor");

export default function ConverterPage() {
  return <CategoryListing slug="conversor" title="Conversores" description={description} locale="es" />;
}
