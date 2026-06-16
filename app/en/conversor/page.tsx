import { CategoryListing, categoryMetadata } from "../../components/CategoryListing";

const description = "Fast online converters for currency, length, time, temperature, weight, digital data, capacity, area, volume and energy.";

export const metadata = categoryMetadata("Converters", description, "conversor", "en");

export default function ConverterPage() {
  return <CategoryListing slug="conversor" title="Converters" description={description} locale="en" />;
}
