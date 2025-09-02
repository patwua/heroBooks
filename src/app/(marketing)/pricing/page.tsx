import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Row({ children }: { children: React.ReactNode }) {
  return <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary" />{children}</li>;
}

export const metadata = { title: "Pricing — heroBooks" };

export default function PricingPage() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold">Simple pricing for every stage</h1>
        <p className="text-muted-foreground mt-2">Transparent plans in GYD. All include VAT-ready invoicing and core reports.</p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {/* Starter */}
        <div className="rounded-2xl border bg-card p-6 flex flex-col">
          <div className="text-sm font-medium">Starter</div>
          <div className="text-3xl font-semibold mt-1">GYD $0</div>
          <div className="text-xs text-muted-foreground">during beta</div>
          <ul className="mt-4 space-y-2">
            <Row>Up to 2 users</Row>
            <Row>Invoices & receipts (PDF/email)</Row>
            <Row>VAT 14% + zero-rated/exempt items</Row>
            <Row>Trial Balance & P&amp;L</Row>
            <Row>Email support</Row>
          </ul>
          <Button asChild className="mt-6">
            <Link href="/sign-up?plan=starter">Start free</Link>
          </Button>
        </div>

        {/* Business (Most Popular) */}
        <div className="rounded-2xl border-2 border-primary bg-card p-6 flex flex-col relative">
          <span className="absolute -top-3 right-6 rounded-full bg-primary text-primary-foreground text-xs px-2 py-1">Most popular</span>
          <div className="text-sm font-medium">Business</div>
          <div className="text-3xl font-semibold mt-1">GYD $9,900<span className="text-base font-normal">/mo</span></div>
          <ul className="mt-4 space-y-2">
            <Row>Unlimited users</Row>
            <Row>Bank import & reconcile</Row>
            <Row>PAYE & NIS summaries</Row>
            <Row>Custom sequences & branding</Row>
            <Row>Priority support</Row>
          </ul>
          <Button asChild className="mt-6">
            <Link href="/sign-up?plan=business">Choose Business</Link>
          </Button>
          <div className="text-xs text-muted-foreground mt-2">Use code <b>GYA-LAUNCH</b> for 50% off first 2 months.</div>
        </div>

        {/* Enterprise */}
        <div className="rounded-2xl border bg-card p-6 flex flex-col">
          <div className="text-sm font-medium">Enterprise</div>
          <div className="text-3xl font-semibold mt-1">Let’s talk</div>
          <ul className="mt-4 space-y-2">
            <Row>SLA & onboarding</Row>
            <Row>Advanced approvals & roles</Row>
            <Row>Data migration assistance</Row>
            <Row>Custom integrations & API limits</Row>
            <Row>Dedicated success manager</Row>
          </ul>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/sign-up?plan=enterprise">Contact sales</Link>
          </Button>
      </div>
      </div>

      <div className="mt-10 rounded-2xl border p-6 bg-muted/40">
        <div className="text-sm font-medium">All plans include</div>
        <ul className="mt-2 grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
          <li>• VAT Summary export for GRA</li>
          <li>• Multi-org support (tenants)</li>
          <li>• Secure, role-based access</li>
          <li>• Email invoicing & PDF receipts</li>
        </ul>
      </div>
    </section>
  );
}
