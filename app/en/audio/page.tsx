import { CategoryListing, categoryMetadata } from "../../components/CategoryListing";

const description =
  "Audio tools to cut, merge, convert, compress, normalize, clean noise, adjust speed, sample rate and channels.";

export const metadata = categoryMetadata("Audio tools", description, "audio", "en");

export default function EnglishAudioPage() {
  return <CategoryListing slug="audio" title="Audio tools" description={description} locale="en" />;
}
