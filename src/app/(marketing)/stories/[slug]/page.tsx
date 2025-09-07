import { notFound } from "next/navigation";
import StoryDetail from "./StoryDetail";
import { stories, getStoryBySlug } from "@/lib/stories";

export function generateStaticParams() {
  return stories
    .filter((s) => s.consent_obtained)
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story || !story.consent_obtained)
    return { robots: { index: false, follow: false } };
  return {
    title: story.title,
    robots: { index: false, follow: false },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story || !story.consent_obtained) notFound();
  return <StoryDetail story={story} />;
}
