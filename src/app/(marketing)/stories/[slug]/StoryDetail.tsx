"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Story, stories } from "@/lib/stories";
import { recordFeatureImpression } from "@/lib/telemetry";

export default function StoryDetail({ story }: { story: Story }) {
  useEffect(() => {
    recordFeatureImpression({ feature: "story_view", meta: { story_id: story.id } });
  }, [story.id]);

  useEffect(() => {
    const thresholds = [25, 50, 75, 100];
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      while (thresholds.length && scrolled >= thresholds[0]) {
        const depth = thresholds.shift()!;
        recordFeatureImpression({
          feature: "story_scroll_depth",
          meta: { story_id: story.id, depth },
        });
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [story.id]);

  const related = stories
    .filter((s) => s.id !== story.id && s.consent_obtained)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="relative h-60 w-full overflow-hidden rounded-xl">
        <Image src={story.image_src} alt={story.persona.name} fill className="object-cover" />
      </div>
      <h1 className="mt-4 text-2xl font-bold">{story.title}</h1>
      <p className="mt-2 text-muted-foreground">
        {story.persona.name} — {story.persona.role}, {story.persona.location}
      </p>
      <div className="mt-6 space-y-4">
        {story.summary_lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      {story.features_used.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold">What they used</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {story.features_used.map((f) => (
              <span key={f} className="rounded-full bg-muted px-3 py-1 text-xs">
                {f}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href={story.cta_href}
          className="rounded-lg bg-emerald-600 px-5 py-3 text-center text-white"
          onClick={() =>
            recordFeatureImpression({
              feature: "story_cta_click",
              meta: { story_id: story.id, label: story.cta_label, href: story.cta_href },
            })
          }
        >
          {story.cta_label}
        </Link>
        <Link
          href={story.try_setup_href}
          className="rounded-lg border px-5 py-3 text-center"
          onClick={() =>
            recordFeatureImpression({
              feature: "story_cta_click",
              meta: { story_id: story.id, label: "Try this setup", href: story.try_setup_href },
            })
          }
        >
          Try this setup
        </Link>
      </div>
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="font-semibold">More stories like this</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {related.map((s) => (
              <div key={s.id} className="flex flex-col overflow-hidden rounded-2xl border">
                <div className="relative h-32 w-full overflow-hidden">
                  <Image src={s.image_src} alt={s.persona.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col p-4">
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.teaser}</p>
                  <Link
                    href={`/stories/${s.slug}`}
                    className="mt-auto text-sm font-medium underline"
                  >
                    See how heroBooks works for them
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <p className="mt-8 text-xs text-muted-foreground">
        Information provided by heroBooks is general in nature and not a substitute for professional tax or legal advice. Testimonials reflect individual experiences. Your results may vary.
      </p>
    </div>
  );
}
