import HeroRandom from "@/components/marketing/HeroRandom";
import TestimonialsRandom from "@/components/marketing/TestimonialsRandom";

export default function MarketingHome() {
  return (
    <main className="container mx-auto px-4 py-12">
      <HeroRandom />

      {/* Features */}
      <section id="features" className="mt-16 grid gap-6 sm:grid-cols-3">
        {[
          { title: "VAT-ready invoicing", text: "One-click VAT, zero-rated & exempt items." },
          { title: "PAYE & NIS summaries", text: "Local payroll deductions made simple." },
          { title: "Clean API", text: "Plug into your dealer or POS system." },
        ].map(f => (
          <div key={f.title} className="rounded-xl border p-6 bg-card">
            <div className="text-lg font-medium">{f.title}</div>
            <p className="text-sm text-muted-foreground mt-2">{f.text}</p>
          </div>
        ))}
      </section>

      {/* Why Local */}
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

      {/* Pricing teaser */}
      <section className="mt-16 text-center">
        <a href="/pricing" className="inline-flex items-center rounded-md bg-primary text-primary-foreground h-10 px-6">See pricing</a>
      </section>
    </main>
  );
}
