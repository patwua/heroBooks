import Image from "next/image";
import Link from "next/link";
import HeroClient from "@/components/marketing/HeroClient";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import PricingSection from "@/components/marketing/PricingSection";
import FAQSection from "@/components/marketing/FAQSection";
import { chooseNOnce } from "@/lib/randomize";
import { heroCopy, HeroKey } from "@/lib/copy/imageCopy";

export default async function HomePage() {
  const keys = Object.keys(heroCopy) as HeroKey[];
  const [hero1Key, hero2Key] = await chooseNOnce("hb_home_heroes", keys, 2);
  const hero1 = heroCopy[hero1Key];
  const hero2 = heroCopy[hero2Key];

  return (
    <div>
      {/* HERO 1 */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <HeroClient
            itemId={hero1Key}
            headline={hero1.headline}
            story={hero1.story}
            ctas={hero1.ctas}
            imgSrc={`/photos/landing/${hero1Key}.webp`}
            reverse
          />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Built for compliance and speed</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {[
              { title: "VAT compliance", desc: "Automatic VAT‑14 and zero‑rated support.", href: "/features#vat" },
              { title: "PAYE & NIS", desc: "Payroll that stays in step with GRA rules.", href: "/features#payroll" },
              { title: "Real‑time reports", desc: "Know your numbers the instant they change.", href: "/features#reports" },
              { title: "Bank reconciliation", desc: "Match transactions in minutes, not hours.", href: "/features#banking" },
              { title: "Multi‑currency", desc: "Invoice and track in USD, GYD, and more.", href: "/features#multicurrency" },
            ].map((f) => (
              <Link key={f.title} href={f.href} className="rounded-2xl border p-6 hover:bg-muted block">
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HERO 2 */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <HeroClient
            itemId={hero2Key}
            headline={hero2.headline}
            story={hero2.story}
            ctas={hero2.ctas}
            imgSrc={`/photos/landing/${hero2Key}.webp`}
          />
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

