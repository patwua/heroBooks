import { notFound } from "next/navigation";
import StoryDetail from "./StoryDetail";
import { stories, getStoryBySlug } from "@/lib/stories";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const story = getStoryBySlug(params.slug);
  if (!story) return { robots: { index: false, follow: false } };
  return {
    title: story.title,
    robots: { index: false, follow: false },
  };
}

export default function StoryPage({ params }: { params: { slug: string } }) {
  const story = getStoryBySlug(params.slug);
  if (!story) notFound();
  return <StoryDetail story={story} />;
}
