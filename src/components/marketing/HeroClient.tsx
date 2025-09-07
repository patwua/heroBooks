"use client";
import Image, { type StaticImageData } from "next/image";
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
  imgSrc: StaticImageData;
  reverse?: boolean;
};

export default function HeroClient({ itemId, headline, story, ctas, imgSrc, reverse }: HeroClientProps) {
  useEffect(() => {
    recordFeatureImpression({
      feature: "hero_impression",
      path: imgSrc.src,
      meta: { location: "marketing_hero_randomized", item_id: itemId },
    });
  }, [itemId, imgSrc]);

  return (
    <div className="relative grid items-center gap-10 py-16 md:grid-cols-2">
      <div className={reverse ? "md:order-2" : undefined}>
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
      <div className={reverse ? "md:order-1" : ""}>
        <Image
          src={imgSrc}
          alt={headline}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="h-auto w-full rounded-2xl border object-cover"
        />
      </div>
    </div>
  );
}

