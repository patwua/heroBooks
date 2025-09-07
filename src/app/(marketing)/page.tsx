import Image from "next/image";
import Link from "next/link";
import HeroRandom from "@/components/marketing/HeroRandom";
import TestimonialsRandom from "@/components/marketing/TestimonialsRandom";

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
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
      <section id="testimonials" className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Trusted by local teams</h2>
          <TestimonialsRandom />
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold">Simple pricing</h2>
            <p className="mt-2 text-sm text-muted-foreground">Start small, scale with your business.</p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {["Starter", "Business", "Enterprise"].map((name, idx) => {
              const featured = idx === 1;
              const price = idx === 0 ? "$19" : idx === 1 ? "$49" : "Custom";
              return (
                <div
                  key={name}
                  className={`relative rounded-2xl border p-6 transition hover:shadow-lg ${
                    featured ? "border-emerald-500 shadow-emerald-100 dark:shadow-emerald-900/20" : ""
                  }`}
                >
                  {featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold">{name}</h3>
                  <p className="mt-1 text-3xl font-extrabold">
                    {price}
                    <span className="text-base font-medium text-muted-foreground">{price !== "Custom" ? "/mo" : ""}</span>
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li>✔ VAT‑ready invoicing</li>
                    <li>✔ Double‑entry ledger</li>
                    <li>✔ Reports & exports</li>
                    <li>{idx > 0 ? "✔ API access" : "— API access"}</li>
                  </ul>
                  <div className="mt-6">
                    <button
                      className={`w-full rounded-lg px-4 py-2 text-center text-white ${
                        featured
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                      }`}
                    >
                      {price === "Custom" ? "Contact sales" : `Choose ${name}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {[
              {
                q: "How does heroBooks handle VAT?",
                a: "Invoices can be tagged VAT‑14, zero‑rated, or exempt; exports are ready for filing.",
              },
              { q: "Is there a demo?", a: "Yes — click ‘Explore in Demo’ to try core flows." },
              { q: "Do you have an API?", a: "Yes — clean REST endpoints for integrations." },
            ].map((item) => (
              <details key={item.q} className="group rounded-2xl border p-4">
                <summary className="cursor-pointer list-none font-medium">{item.q}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/help" className="text-sm font-medium text-emerald-700 hover:underline">
              View the full Help & FAQ →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
