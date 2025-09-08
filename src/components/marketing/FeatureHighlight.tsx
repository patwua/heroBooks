"use client";
import Image from "next/image";

export default function FeatureHighlight() {
  return (
    <section
      aria-labelledby="feature-highlight-title"
      className="w-full mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 md:py-12"
    >
      <div className="flex items-center justify-between gap-6 mb-4">
        <div>
          <h2
            id="feature-highlight-title"
            className="text-2xl md:text-3xl font-semibold tracking-tight"
          >
            Feature Highlights
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            A quick look at what heroBooks does best.
          </p>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 bg-background">
        <Image
          src="/landing/feature-highlight-fast.webp"
          alt="heroBooks feature highlights: Smart Invoices, Instant Reports, Bank Reconciliation, and Tax Compliance."
          width={1024}
          height={1024}
          priority={false}
          loading="lazy"
          unoptimized
          className="w-full h-auto block"
        />
      </div>
    </section>
  );
}
