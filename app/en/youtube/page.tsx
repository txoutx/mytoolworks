import { CategoryListing, categoryMetadata } from "../../components/CategoryListing";

const description =
  "YouTube tools for thumbnails, metadata, MP3/MP4 estimates, Shorts, playlists, transcripts and video SEO.";

export const metadata = categoryMetadata("YouTube Tools", description, "youtube", "en");

export default function EnglishYouTubePage() {
  return <CategoryListing slug="youtube" title="YouTube Tools" description={description} locale="en" />;
}
