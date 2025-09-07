"use client";
import Image from "next/image";
import { useEffect } from "react";
import { recordFeatureImpression } from "@/lib/telemetry";

export type TestimonialClientProps = {
  itemId: string;
  quote: string;
  name: string;
  role: string;
  imgSrc: string;
};

export default function TestimonialClient({ itemId, quote, name, role, imgSrc }: TestimonialClientProps) {
  useEffect(() => {
    recordFeatureImpression({ feature: "testimonial_impression", reason: itemId, path: imgSrc });
  }, [itemId, imgSrc]);

  return (
    <section className="mt-16">
      <div className="rounded-2xl border p-6 grid gap-6 sm:grid-cols-[120px_1fr] items-center bg-muted/30">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border">
          <Image src={imgSrc} alt={name} fill className="object-cover" />
        </div>
        <div className="text-sm">
          <p className="text-foreground text-lg leading-snug">“{quote}”</p>
          <p className="text-muted-foreground mt-2">{name}</p>
          <p className="text-muted-foreground text-xs">{role}</p>
        </div>
      </div>
    </section>
  );
}
