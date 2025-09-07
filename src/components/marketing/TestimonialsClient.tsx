"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { recordFeatureImpression } from "@/lib/telemetry";
import { getStoryById } from "@/lib/stories";
import ComingSoonOverlay from "@/components/marketing/ComingSoonOverlay";
import { testimonialCopy } from "@/lib/copy/imageCopy";
import { testimonialImages } from "@/lib/images";

const headings = [
  "Trusted by local professionals",
  "Trusted by local trades",
  "Trusted by growing businesses in Guyana and across the Caribbean",
];

export type TestimonialsClientProps = {
  heading?: string;
  entries: [TestimonialKey, (typeof testimonialCopy)[TestimonialKey]][];
};

export default function TestimonialsClient({ heading, entries }: TestimonialsClientProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [title, setTitle] = useState(heading ?? headings[0]);

  useEffect(() => {
    if (!heading) {
      setTitle(headings[Math.floor(Math.random() * headings.length)]);
    }
  }, [heading]);

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
    <>
      <h2 className="text-2xl font-bold text-center md:text-left">{title}</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {entries.map(([id, t]) => {
          const story = getStoryById(t.storyId);
          const imgSrc = testimonialImages[id as keyof typeof testimonialImages];
          const isOpen = open[id];
          return (
            <div
              key={id}
              className="relative flex cursor-pointer flex-col gap-2 rounded-xl border p-4 bg-muted/30 text-sm"
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
              <div className="flex gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border">
                  {imgSrc && (
                    <Image
                      src={imgSrc}
                      alt={t.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <p className="leading-snug line-clamp-3">“{t.quote}”</p>
              </div>
              {isOpen && story && (
                <div className="mt-2 flex flex-col gap-2">
                  {story.summary_lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  {story.consent_obtained ? (
                    <a
                      href={story.try_setup_href}
                      className="mt-2 inline-block font-medium underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        recordFeatureImpression({
                          feature: "case_study_try_setup_click",
                          meta: { story_id: t.storyId, href: story.try_setup_href },
                        });
                      }}
                    >
                      Try this setup
                    </a>
                  ) : (
                    <ComingSoonOverlay story={story} trySetup />
                  )}
                </div>
              )}
              <div className="mt-auto pt-2 text-xs text-muted-foreground">
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
    </>
  );
}
