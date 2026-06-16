import { CategoryListing, categoryMetadata } from "../../components/CategoryListing";

const description =
  "Online audio tools to cut, merge, convert, compress, normalize, clean noise, adjust speed and channels.";

export const metadata = categoryMetadata("Audio", description, "audio", "en");

export default function EnglishAudioPage() {
  return <CategoryListing slug="audio" title="Audio" description={description} locale="en" />;
}
