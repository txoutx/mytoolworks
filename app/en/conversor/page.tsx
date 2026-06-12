import { CategoryListing, categoryMetadata } from "../../components/CategoryListing";

const description = "Fast converters for currency, length, time, temperature, weight, digital data, capacity, area, volume and energy.";

export const metadata = categoryMetadata("Online converters", description, "conversor", "en");

export default function ConverterPage() {
  return <CategoryListing slug="conversor" title="Online converters" description={description} locale="en" />;
}
