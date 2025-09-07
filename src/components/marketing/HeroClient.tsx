"use client";
import Image from "next/image";
import TrackLink from "@/components/marketing/TrackLink";
import { useEffect } from "react";
import { recordFeatureImpression } from "@/lib/telemetry";

export type HeroClientProps = {
  itemId: string;
  headline: string;
  story: string;
  ctas: {
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
  imgSrc: string;
};

export default function HeroClient({ itemId, headline, story, ctas, imgSrc }: HeroClientProps) {
  useEffect(() => {
    recordFeatureImpression({
      feature: "hero_impression",
      path: imgSrc,
      meta: { location: "marketing_hero_randomized", item_id: itemId },
    });
  }, [itemId, imgSrc]);

  return (
    <div className="relative grid items-center gap-10 py-16 md:grid-cols-2">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">{headline}</h2>
        <p className="mt-3 text-muted-foreground">{story}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <TrackLink
            href={ctas.primary.href}
            className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-primary-foreground"
            event="cta_primary"
            meta={{ hero: itemId }}
          >
            {ctas.primary.label}
          </TrackLink>
          <TrackLink
            href={ctas.secondary.href}
            className="inline-flex h-10 items-center rounded-md border px-6 text-sm"
            event="cta_secondary"
            meta={{ hero: itemId }}
          >
            {ctas.secondary.label}
          </TrackLink>
        </div>
      </div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border">
        <Image src={imgSrc} alt={headline} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
      </div>
    </div>
  );
}

