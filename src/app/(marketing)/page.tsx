import HeroRandom from "@/components/marketing/HeroRandom";
import FeaturesRandom from "@/components/marketing/FeaturesRandom";
import TestimonialsRandom from "@/components/marketing/TestimonialsRandom";
import TipsAdsRandom from "@/components/marketing/TipsAdsRandom";

export default function MarketingHome() {
  return (
    <main className="container mx-auto px-4 py-12">
      <HeroRandom />
      <FeaturesRandom count={6} />
      <section id="why-local" className="mt-16 rounded-2xl border bg-primary/5 p-6">
        <h2 className="text-xl font-semibold">Why Local</h2>
        <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
          <li>✓ Built around GRA requirements</li>
          <li>✓ VAT, NIS & PAYE workflows out of the box</li>
          <li>✓ Local support and term-friendly pricing</li>
          <li>✓ Familiar reports and exports</li>
        </ul>
      </section>
      <TestimonialsRandom />
      <TipsAdsRandom />
      <section className="mt-16 text-center">
        <a href="/pricing" className="inline-flex items-center rounded-md bg-primary text-primary-foreground h-10 px-6">See pricing</a>
      </section>
    </main>
  );
}
