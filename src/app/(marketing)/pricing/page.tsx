import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PricingComparison, { PlanKey } from "@/components/marketing/PricingComparison";

function Row({ children }: { children: React.ReactNode }) {
  return <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary" />{children}</li>;
}

export const metadata = { title: "Pricing - heroBooks" };

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const nextRaw = Array.isArray(params?.next) ? params.next[0] : params?.next;
  const next =
    typeof nextRaw === "string" && nextRaw.startsWith("/") && !nextRaw.startsWith("//")
      ? nextRaw
      : "/sign-up";
  const highlightRaw =
    (Array.isArray(params?.highlight) ? params.highlight[0] : params?.highlight) || "business";
  const highlight = (["starter", "business", "enterprise"].includes(highlightRaw) ? highlightRaw : "business") as PlanKey;

  return (
    <section className="w-full bg-orange-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-semibold">Simple pricing for every stage</h1>
          <p className="text-muted-foreground mt-2">Transparent plans in GYD. All include VAT-ready invoicing and core reports.</p>
        </div>

        {/* Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl border bg-card p-6 flex flex-col">
            <div className="text-sm font-medium">Starter</div>
            <div className="text-3xl font-semibold mt-1">
              <span className="line-through text-muted-foreground">GYD $3,000</span>
              <span className="ml-2">Free</span>
            </div>
            <div className="text-xs text-muted-foreground">30-day trial</div>
            <ul className="mt-4 space-y-2">
              <Row>Up to 2 users</Row>
              <Row>Invoices & receipts (PDF/email)</Row>
              <Row>VAT 14% + zero-rated/exempt items</Row>
              <Row>Trial Balance & P&amp;L</Row>
              <Row>Email support</Row>
            </ul>
            <Button asChild className="mt-6">
              <Link href={`${next}?plan=starter`}>Start free</Link>
            </Button>
          </div>

          <div className="rounded-2xl border-2 border-primary bg-card p-6 flex flex-col relative">
            <span className="absolute -top-3 right-6 rounded-full bg-primary text-primary-foreground text-xs px-2 py-1">Most popular</span>
            <div className="text-sm font-medium">Essentials</div>
            <div className="text-3xl font-semibold mt-1">GYD $5,000<span className="text-base font-normal">/mo</span></div>
            <ul className="mt-4 space-y-2">
              <Row>Up to 5 users</Row>
              <Row>Bank import & reconcile</Row>
              <Row>PAYE & NIS summaries</Row>
              <Row>Custom sequences & branding</Row>
              <Row>Priority support</Row>
            </ul>
            <Button asChild className="mt-6">
              <Link href={`/checkout?plan=essentials`}>Choose Essentials</Link>
            </Button>
          </div>

          <div className="rounded-2xl border bg-card p-6 flex flex-col">
            <div className="text-sm font-medium">Growth</div>
            <div className="text-3xl font-semibold mt-1">GYD $10,000<span className="text-base font-normal">/mo</span></div>
            <ul className="mt-4 space-y-2">
              <Row>Unlimited users</Row>
              <Row>Advanced approvals & roles</Row>
              <Row>Inventory tracking</Row>
              <Row>Multi-currency support</Row>
              <Row>Priority chat support</Row>
            </ul>
            <Button asChild className="mt-6">
              <Link href={`/checkout?plan=growth`}>Choose Growth</Link>
            </Button>
          </div>

          <div className="rounded-2xl border bg-card p-6 flex flex-col">
            <div className="text-sm font-medium">Pro</div>
            <div className="text-3xl font-semibold mt-1">Custom pricing</div>
            <ul className="mt-4 space-y-2">
              <Row>SLA & onboarding</Row>
              <Row>Custom integrations & API limits</Row>
              <Row>Data migration assistance</Row>
              <Row>Dedicated success manager</Row>
              <Row>White-glove support</Row>
            </ul>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/contact">Contact sales</Link>
            </Button>
          </div>
        </div>

        {/* Comparison matrix with highlight & next */}
        <PricingComparison next={next} highlight={highlight} />

        <div className="mt-10 rounded-2xl border p-6 bg-muted/40">
          <div className="text-sm font-medium">All plans include</div>
          <ul className="mt-2 grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <li>• VAT Summary export for GRA</li>
            <li>• Multi-org support (tenants)</li>
            <li>• Secure, role-based access</li>
            <li>• Email invoicing & PDF receipts</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

