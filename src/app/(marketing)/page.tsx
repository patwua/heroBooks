import Image from "next/image";
import Link from "next/link";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import PricingSection from "@/components/marketing/PricingSection";
import DemoEnterButton from "@/components/marketing/DemoEnterButton";
import { resolveHeroVariant } from "@/lib/heroVariants";
import { FeatureCard } from "@/components/marketing/FeatureCard";

async function ClassicLanding() {
  const { content } = await resolveHeroVariant();
  return (
    <div className="space-y-24 py-10">
      {/* HERO (single, stronger focus) */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            {content.headline}
          </h1>
          <p className="text-muted-foreground">{content.subhead}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/#pricing" className="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700">
              Get Started
            </Link>
            <DemoEnterButton label="Explore the demo" />
          </div>
        </div>
        <div>
          <Image
            src={content.img}
            alt={content.alt}
            width={1024}
            height={1024}
            className="rounded-2xl aspect-square object-cover"
            priority
            sizes="(min-width: 1024px) 600px, 100vw"
          />
        </div>
      </section>

      {/* FEATURES (anchor) — copy left, animated banner right */}
      <section id="features" className="grid md:grid-cols-2 gap-10 items-center">
        <div className="order-2 md:order-1 space-y-3">
          <h2 className="text-3xl font-bold">What to expect</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>VAT‑ready invoices and returns</li>
            <li>PAYE/NIS schedules</li>
            <li>Bank import & reconcile</li>
            <li>Clean exports your accountant will like</li>
          </ul>
          <div>
            <Link href="/#pricing" className="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700">
              See pricing
            </Link>
          </div>
        </div>
      <div className="order-1 md:order-2">
          <Image src="/landing/feature-demo.webp" alt="Feature overview" width={1024} height={1024} className="rounded-2xl aspect-square object-cover" />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section>
        <TestimonialsSection />
      </section>

      {/* PRICING (anchor) */}
      <section id="pricing">
        <PricingSection />
      </section>
    </div>
  );
}

function CurrentLanding() {
  return (
    <div className="space-y-28 py-10">
      {/* Hero #1 (right image, left copy) */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="order-2 md:order-1 space-y-4">
          <h1 className="text-4xl font-bold">Local-first accounting for Guyana</h1>
          <p className="text-muted-foreground">VAT-ready invoices, PAYE/NIS schedules, and reports that match how you actually work.</p>
          <div className="flex gap-3">
            <Link href="/#pricing" className="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700">Start free trial</Link>
            <DemoEnterButton />
          </div>
        </div>
        <div className="order-1 md:order-2">
          <Image src="/landing/feature-demo.webp" alt="Feature demo" width={800} height={800} className="rounded-2xl aspect-square object-cover" />
        </div>
      </section>

      {/* Separator: Feature highlights (anchor) */}
      <section id="features" className="space-y-10">
        <h2 className="text-3xl font-bold">Features</h2>
        <FeatureCard title="Smart Invoices" body="VAT-ready, automatic postings." img="/landing/accounting.webp" />
        <FeatureCard title="Dealer COGS" body="Per-unit duty & reconditioning built in." img="/landing/dealership.webp" />
      </section>

      {/* Hero #2 (left image, right copy) */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="order-1">
          <Image src="/landing/logistics.webp" alt="Logistics" width={800} height={800} className="rounded-2xl aspect-square object-cover" />
        </div>
        <div className="order-2 space-y-4">
          <h2 className="text-3xl font-bold">Built for SMEs across industries</h2>
          <p className="text-muted-foreground">From salons to contractors: simple flows, clean exports, solid audit trails.</p>
        </div>
      </section>

      {/* Separator: Testimonials */}
      <section>
        <TestimonialsSection />
      </section>

      {/* Hero #3 (right image) */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="order-2 md:order-1 space-y-4">
          <h2 className="text-3xl font-bold">Bank import & reconcile</h2>
          <p className="text-muted-foreground">CSV/OFX import, rules, matches — less manual entry, better books.</p>
        </div>
        <div className="order-1 md:order-2">
          <Image src="/landing/bank.webp" alt="Banking" width={800} height={800} className="rounded-2xl aspect-square object-cover" />
        </div>
      </section>

      {/* Anchor: Pricing */}
      <section id="pricing">
        <PricingSection />
      </section>

      {/* Hero #4 (left image) */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="order-1">
          <Image src="/landing/salon.webp" alt="Salon" width={800} height={800} className="rounded-2xl aspect-square object-cover" />
        </div>
        <div className="order-2 space-y-4">
          <h2 className="text-3xl font-bold">Close your books with confidence</h2>
          <p className="text-muted-foreground">P&L, Trial Balance, VAT Summary — and exports your accountant will like.</p>
        </div>
      </section>
    </div>
  );
}

export default async function MarketingHome() {
  const variant = process.env.LANDING_VARIANT || "classic";
  return variant === "current" ? <CurrentLanding /> : await ClassicLanding();
}

