import Link from "next/link";
import { Button } from "@/components/ui/button";
import TaxStrip from "@/components/marketing/TaxStrip";
import LogosMarquee from "@/components/marketing/LogosMarquee";
import FeatureCard from "@/components/marketing/FeatureCard";
import DemoEnterButton from "@/components/marketing/DemoEnterButton";
import { FileSpreadsheet, Receipt, Calculator, Banknote, ShieldCheck, PlugZap } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Guyana-first accounting.
            <br className="hidden sm:block" />
            <span className="text-primary"> VAT-ready. Fast. Familiar.</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Modern, multi-tenant accounting tailored for Guyana: VAT, PAYE & NIS basics out-of-the-box,
            clean reports, and an API to plug into your dealer system.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <DemoEnterButton label="Try the demo" />
            <Button asChild size="lg">
              {/* Default to business for best fit */}
              <Link href="/sign-up?plan=business">Start free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
          <div className="mt-6 text-xs text-muted-foreground">No credit card. Cancel anytime.</div>
        </div>
      </section>

      <div className="mb-8">
        <TaxStrip />
      </div>

      {/* MARQUEE */}
      <LogosMarquee />

      {/* FEATURES */}
      <section id="features" className="container mx-auto px-4 py-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold">Everything you need to stay compliant</h2>
          <p className="text-muted-foreground mt-2">Local VAT logic, clean invoices, and banking flows that make sense.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="VAT-ready invoicing"
            desc="Standard, zero-rated, and exempt items; tax codes and returns export."
            icon={<Receipt className="h-5 w-5" />}
          />
          <FeatureCard
            title="Double-entry ledger"
            desc="Every sale, bill, and payment posts to the GL with audit trails."
            icon={<Calculator className="h-5 w-5" />}
          />
          <FeatureCard
            title="Bank import & reconcile"
            desc="Upload CSV from your bank; auto-match with absolute value rules."
            icon={<Banknote className="h-5 w-5" />}
          />
          <FeatureCard
            title="Payroll basics (PAYE/NIS)"
            desc="Track earnings and statutory deductions; export summaries."
            icon={<FileSpreadsheet className="h-5 w-5" />}
          />
          <FeatureCard
            title="Multi-tenant & secure"
            desc="Strict org scoping and membership checks; least-privilege roles."
            icon={<ShieldCheck className="h-5 w-5" />}
          />
          <FeatureCard
            title="Clean API"
            desc="Integrate your DMS or website to sync customers, invoices, and payments."
            icon={<PlugZap className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* WHY LOCAL */}
      <section id="why-local" className="container mx-auto px-4 pb-14">
        <div className="rounded-2xl border p-6 sm:p-10 bg-card grid gap-6 lg:grid-cols-2 items-center">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold">Why choose a local accounting platform?</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>• VAT rules that mirror real Guyana practice (standard/zero-rated/exempt).</li>
              <li>• Familiar reports: VAT Summary, Trial Balance, Profit & Loss.</li>
              <li>• PAYE & NIS basics so payroll isn’t a spreadsheet chore.</li>
              <li>• Exports your accountant can use directly for GRA filing.</li>
              <li>• Local support. No guessing around foreign tax terms.</li>
            </ul>
          </div>
          <div className="rounded-xl border bg-background p-6">
            <div className="text-sm font-medium mb-3">Quick snapshot</div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">Average time saved</div>
                <div className="text-2xl font-semibold mt-1">7h/week</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">AR collection lift</div>
                <div className="text-2xl font-semibold mt-1">+22%</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">Setup time</div>
                <div className="text-2xl font-semibold mt-1">&lt; 10 min</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">VAT return export</div>
                <div className="text-2xl font-semibold mt-1">1-click</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="rounded-2xl border bg-primary/10 p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-semibold">Start free and get compliant faster</h3>
          <p className="text-muted-foreground mt-2">Invite your accountant anytime—no extra seat fee during beta.</p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Button asChild size="lg">
              <a href="/sign-up?plan=business">Create your account</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/pricing">See plans</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
