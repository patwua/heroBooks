import Image from "next/image";
import Link from "next/link";
import HeroStatic from "@/components/marketing/HeroStatic";
import HeroRandom from "@/components/marketing/HeroRandom";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import PricingSection from "@/components/marketing/PricingSection";
import FAQSection from "@/components/marketing/FAQSection";

export default function HomePage() {
  return (
    <div>
      {/* HERO STATIC */}
      <section className="border-b">
        <HeroStatic />
      </section>

      {/* HERO RANDOMIZED STORY */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <HeroRandom />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Built for compliance and speed</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { title: "VAT‑ready Invoicing", desc: "Zero‑rated, VAT‑14, and clean tax exports." },
              { title: "Double‑entry ledger", desc: "Accurate accounting made simple." },
              { title: "Clean API", desc: "Integrates easily with your software." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border p-6">
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY LOCAL */}
      <section id="why-local" className="border-t">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold">Why Choose Local?</h2>
            <p className="mt-4 text-muted-foreground">
              Think local, act local — utilize accounting software that understands and meets the demands of Guyanese businesses.
            </p>
            <div className="mt-6">
              <Link
                href="#pricing"
                className="rounded-lg bg-emerald-600 px-5 py-3 text-white shadow hover:bg-emerald-700"
              >
                Get Started
              </Link>
            </div>
          </div>
          <div className="relative h-[300px] w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800">
            <Image
              src="/photos/landing/why-placeholder.jpg"
              alt="Why Local"
              fill
              className="rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialsSection />

      {/* PRICING */}
      <PricingSection />

      {/* FAQ */}
      <FAQSection />
    </div>
  );
}

