"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { testimonialCopy } from "@/lib/copy/imageCopy";
import { recordFeatureImpression } from "@/lib/telemetry";
import { getStoryById } from "@/lib/stories";
import ComingSoonOverlay from "@/components/marketing/ComingSoonOverlay";

const headings = [
  "Trusted by local professionals",
  "Trusted by local trades",
  "Trusted by growing businesses in Guyana",
];

export default function TestimonialsSection() {
  const [heading, setHeading] = useState(headings[0]);
  const entries = Object.entries(testimonialCopy);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setHeading(headings[Math.floor(Math.random() * headings.length)]);
  }, []);

  useEffect(() => {
    recordFeatureImpression({
      feature: "testimonial_impression",
      meta: {
        location: "marketing_testimonials",
        item_ids: entries.map(([id]) => id),
      },
    });
  }, [entries]);

  return (
    <section id="testimonials" className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center md:text-left">{heading}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {entries.map(([id, t]) => {
            const story = getStoryById(t.storyId);
            const imgSrc = `/photos/testimonials/${id}.webp`;
            const isOpen = open[id];
            return (
              <div key={id} className="rounded-2xl border p-6 flex flex-col gap-4 bg-muted/30">
                <div className="relative h-24 w-24 overflow-hidden rounded-xl border">
                  <Image src={imgSrc} alt={t.name} fill className="object-cover" />
                </div>
                <p className="text-sm leading-snug">“{t.quote}”</p>
                <p className="text-xs">{t.teaser}</p>
                <button
                  className="mt-2 text-sm font-medium underline"
                  onClick={() => {
                    const next = { ...open, [id]: !isOpen };
                    setOpen(next);
                    if (!isOpen) {
                      recordFeatureImpression({
                        feature: "case_study_open",
                        meta: { story_id: t.storyId, placement: "testimonials_inline" },
                      });
                    }
                  }}
                >
                  See how heroBooks works for them
                </button>
                {isOpen && story && (
                  <div className="relative mt-4 flex flex-col gap-2 text-sm">
                    {story.summary_lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                    {story.consent_obtained && (
                      <a
                        href={story.try_setup_href}
                        className="mt-2 inline-block text-sm font-medium underline"
                        onClick={() =>
                          recordFeatureImpression({
                            feature: "case_study_try_setup_click",
                            meta: { story_id: t.storyId, href: story.try_setup_href },
                          })
                        }
                      >
                        Try this setup
                      </a>
                    )}
                    {!story.consent_obtained && (
                      <ComingSoonOverlay story={story} trySetup />
                    )}
                  </div>
                )}
                <div className="mt-auto text-xs text-muted-foreground">
                  <div className="font-medium text-foreground">{t.name}</div>
                  <div>{t.role}</div>
                  <div className="mt-1">{t.since}</div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Real customers. Real operations. Photos edited for clarity.
        </p>
      </div>
    </section>
  );
}

