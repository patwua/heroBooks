"use client";

import Image from "next/image";
import TrackLink from "@/components/marketing/TrackLink";
import { useEffect } from "react";
import { recordFeatureImpression } from "@/lib/telemetry";

export default function HeroStatic() {
  useEffect(() => {
    recordFeatureImpression({
      feature: "hero_impression",
      meta: { location: "marketing_hero_static", item_id: "static" },
    });
  }, []);

  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:px-8 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">
            Modern, multi-tenant accounting tailored for Guyana
          </h1>
          <p className="mt-3 text-muted-foreground">
            VAT-ready invoices, clear reports, and integrations that plug into your dealer or service workflows.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <TrackLink
              href="/get-started"
              className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-primary-foreground"
              event="cta_primary"
              meta={{ hero: "static" }}
            >
              Get Started
            </TrackLink>
            <TrackLink
              href="/demo"
              className="inline-flex h-10 items-center rounded-md border px-6 text-sm"
              event="cta_secondary"
              meta={{ hero: "static" }}
            >
              Explore in Demo
            </TrackLink>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Local rules in mind: VAT, PAYE, and NIS—built for Guyana.
          </p>
        </div>
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border">
          <Image
            src="/photos/landing/accounting.webp"
            alt="heroBooks dashboard preview"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-muted-foreground">
        Trusted across Guyana • Retail • Beauty • Logistics • Dealers
      </div>
    </section>
  );
}

