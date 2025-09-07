import { Check, Minus } from "lucide-react";

export type PlanKey = "starter" | "essentials" | "growth" | "pro";

const basePlans: { key: PlanKey; name: string; price: string }[] = [
  { key: "starter", name: "Starter", price: "GYD $3,000 / mo" },
  { key: "essentials", name: "Essentials", price: "GYD $5,000 / mo" },
  { key: "growth", name: "Growth", price: "GYD $10,000 / mo" },
  { key: "pro", name: "Pro", price: "Custom" },
];

const features: { label: string; notes?: string; included: Partial<Record<PlanKey, boolean>> }[] = [
  { label: "Users", notes: "Starter: up to 2", included: { starter: true, essentials: true, growth: true, pro: true } },
  { label: "VAT-ready invoicing", included: { starter: true, essentials: true, growth: true, pro: true } },
  { label: "Bank import & reconcile", included: { starter: false, essentials: true, growth: true, pro: true } },
  { label: "PAYE & NIS summaries", included: { starter: false, essentials: true, growth: true, pro: true } },
  { label: "Advanced approvals & roles", included: { starter: false, essentials: false, growth: true, pro: true } },
  { label: "Custom integrations & API limits", included: { starter: false, essentials: false, growth: false, pro: true } },
];

function Cell({ ok }: { ok: boolean | undefined }) {
  if (ok) return <Check className="h-4 w-4" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export default function PricingComparison({
  next = "/sign-up",
  highlight = "essentials",
}: {
  next?: string;
  highlight?: PlanKey;
}) {
  const plans = basePlans.map((p) => ({ ...p, highlight: p.key === highlight }));
  return (
    <div className="mt-12 border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-5 bg-muted/40">
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
          <div key={f.label} className="grid grid-cols-5 items-center">
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

      {/* CTAs respect `next` */}
      <div className="grid grid-cols-5 bg-muted/30">
        <div className="p-4 text-sm font-medium">Choose your plan</div>
        {plans.map((p) => {
          const href = p.key === "pro" ? "/contact" : `${next}?plan=${encodeURIComponent(p.key)}`;
          const label = p.key === "pro" ? "Contact sales" : `Choose ${p.name}`;
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
