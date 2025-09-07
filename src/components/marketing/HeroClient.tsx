"use client";
import Image from "next/image";
import TrackLink from "@/components/marketing/TrackLink";
import { useEffect } from "react";
import { recordFeatureImpression } from "@/lib/telemetry";

export type HeroClientProps = {
  itemId: string;
  headline: string;
  subhead: string;
  cta: { label: string; href: string };
  imgSrc: string;
};

export default function HeroClient({ itemId, headline, subhead, cta, imgSrc }: HeroClientProps) {
  useEffect(() => {
    recordFeatureImpression({ feature: "hero_impression", reason: itemId, path: imgSrc });
  }, [itemId, imgSrc]);

  return (
    <div className="relative grid items-center gap-10 md:grid-cols-2 pt-16">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight">{headline}</h1>
        <p className="mt-3 text-muted-foreground">{subhead}</p>
        <div className="mt-6 flex items-center gap-3">
          <TrackLink
            href={cta.href}
            className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-primary-foreground"
            event="cta_primary"
            meta={{ hero: itemId }}
          >
            {cta.label}
          </TrackLink>
        </div>
      </div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border">
        <Image src={imgSrc} alt="heroBooks hero" fill sizes="(min-width: 768px) 50vw, 100vw" priority className="object-cover" />
      </div>
    </div>
  );
}
