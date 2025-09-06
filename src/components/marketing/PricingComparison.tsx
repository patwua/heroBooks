import { Check, Minus } from "lucide-react";

type PlanKey = "starter" | "business" | "enterprise";

const plans: { key: PlanKey; name: string; price: string; highlight?: boolean }[] = [
  { key: "starter", name: "Starter", price: "GYD $0 (beta)" },
  { key: "business", name: "Business", price: "GYD $9,900 / mo", highlight: true },
  { key: "enterprise", name: "Enterprise", price: "Let’s talk" },
];

// Each feature maps which plans include it
const features: { label: string; notes?: string; included: Partial<Record<PlanKey, boolean>> }[] = [
  { label: "Users", notes: "Starter: up to 2", included: { starter: true, business: true, enterprise: true } },
  { label: "VAT-ready invoicing", included: { starter: true, business: true, enterprise: true } },
  { label: "Double-entry ledger", included: { starter: true, business: true, enterprise: true } },
  { label: "Bank import & reconcile", included: { starter: false, business: true, enterprise: true } },
  { label: "PAYE & NIS summaries", included: { starter: false, business: true, enterprise: true } },
  { label: "Custom sequences & branding", included: { starter: false, business: true, enterprise: true } },
  { label: "Priority support", included: { starter: false, business: true, enterprise: true } },
  { label: "Advanced approvals & roles", included: { starter: false, business: false, enterprise: true } },
  { label: "SLA & onboarding", included: { starter: false, business: false, enterprise: true } },
  { label: "Custom integrations & API limits", included: { starter: false, business: false, enterprise: true } },
];

function Cell({ ok }: { ok: boolean | undefined }) {
  if (ok) return <Check className="h-4 w-4" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export default function PricingComparison({ next = "/sign-up" }: { next?: string }) {
  return (
    <div className="mt-12 border rounded-2xl overflow-hidden">
      {/* Header row */}
      <div className="grid grid-cols-4 bg-muted/40">
        <div className="p-4 text-sm font-medium">Features</div>
        {plans.map((p) => (
          <div key={p.key} className={`p-4 text-sm font-medium ${p.highlight ? "bg-primary/10" : ""}`}>
            <div className="text-base">{p.name}</div>
            <div className="text-xs text-muted-foreground">{p.price}</div>
          </div>
        ))}
      </div>

      {/* Feature rows */}
      <div className="divide-y">
        {features.map((f) => (
          <div key={f.label} className="grid grid-cols-4 items-center">
            <div className="p-3 text-sm">
              <div>{f.label}</div>
              {f.notes && <div className="text-xs text-muted-foreground">{f.notes}</div>}
            </div>
            {plans.map((p) => (
              <div key={p.key} className={`p-3 flex items-center ${p.highlight ? "bg-primary/5" : ""}`}>
                <Cell ok={f.included[p.key]} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-4 bg-muted/30">
        <div className="p-4 text-sm font-medium">Choose your plan</div>
        {plans.map((p) => {
          const href =
            p.key === "enterprise"
              ? "/contact"
              : `${next}?plan=${encodeURIComponent(p.key)}`;
          const label = p.key === "enterprise" ? "Contact sales" : `Choose ${p.name}`;
          return (
            <div key={p.key} className={`p-4 ${p.highlight ? "bg-primary/10" : ""}`}>
              <a href={href} className="inline-flex items-center justify-center w-full rounded-md border px-3 py-2 text-sm">
                {label}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

