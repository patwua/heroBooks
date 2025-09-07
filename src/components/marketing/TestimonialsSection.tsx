"use client";

import Image from "next/image";
import { useEffect } from "react";
import { testimonialCopy } from "@/lib/copy/imageCopy";
import { chooseOnce } from "@/lib/randomize";
import { recordFeatureImpression } from "@/lib/telemetry";

const headings = [
  "Trusted by local professionals",
  "Trusted by local trades",
  "Trusted by growing businesses in Guyana",
];

export default function TestimonialsSection() {
  const heading = chooseOnce("hb_testimonial_heading", headings);
  const entries = Object.entries(testimonialCopy);
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
            const quote = t.quotes[Math.floor(Math.random() * t.quotes.length)];
            const imgSrc = `/photos/testimonials/${id}.webp`;
            return (
              <div key={id} className="rounded-2xl border p-6 flex flex-col gap-4 bg-muted/30">
                <div className="relative h-24 w-24 overflow-hidden rounded-xl border">
                  <Image src={imgSrc} alt={t.name} fill className="object-cover" />
                </div>
                <p className="text-sm leading-snug">“{quote}”</p>
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

