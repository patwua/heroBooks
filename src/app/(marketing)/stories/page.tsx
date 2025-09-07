import StoriesListing from "./StoriesListing";

export const metadata = {
  title: "Customer stories",
  robots: { index: false, follow: false },
};

export default function StoriesPage() {
  return <StoriesListing />;
}
