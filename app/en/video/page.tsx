import { CategoryListing, categoryMetadata } from "../../components/CategoryListing";

const description =
  "Online video editor with a visual timeline to cut, merge, crop, rotate, adjust speed, volume, capture frames and export.";

export const metadata = categoryMetadata("Video", description, "video", "en");

export default function EnglishVideoPage() {
  return <CategoryListing slug="video" title="Video" description={description} locale="en" />;
}
