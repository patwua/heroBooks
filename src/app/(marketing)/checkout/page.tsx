"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { normalizePlan, type Plan } from "@/lib/plans";

const PRICES: Record<Plan, number> = { starter: 0, business: 9900, enterprise: 0 };

export default function CheckoutPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const initialPlan = normalizePlan(sp.get("plan"));
  const [plan, setPlan] = useState<Plan>(initialPlan);
  const [promo, setPromo] = useState<string>("GYA-LAUNCH");
  const [method, setMethod] = useState<"paypal" | "zelle" | "mmg" | "bank">("paypal");
  const [submitting, setSubmitting] = useState(false);

  const base = PRICES[plan];
  const { final, discount } = useMemo(() => {
    const code = (promo ?? "").trim().toUpperCase();
    if (base && code === "GYA-LAUNCH") {
      const d = Math.round(base * 0.5);
      return { final: base - d, discount: d };
    }
    return { final: base, discount: 0 };
  }, [base, promo]);

  function formatGYD(n: number) {
    try { return new Intl.NumberFormat(undefined, { style: "currency", currency: "GYD", maximumFractionDigits: 0 }).format(n); }
    catch { return `GYD $${n.toLocaleString()}`; }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/subscribe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, promoCode: promo, paymentMethod: method }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Checkout failed");
      router.push(data.redirectUrl);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container mx-auto px-4 py-12 max-w-lg">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        {/* Plan */}
        <fieldset className="rounded-xl border p-4">
          <legend className="text-sm font-medium px-1">Plan</legend>
          <div className="mt-3 grid gap-2">
            {(["starter", "business", "enterprise"] as Plan[]).map((p) => (
              <label key={p} className="flex items-center justify-between gap-2 text-sm">
                <span className="capitalize">{p}</span>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">{formatGYD(PRICES[p])}{p === "enterprise" && " (sales)"}</span>
                  <input type="radio" name="plan" value={p} checked={plan === p} onChange={() => setPlan(p)} />
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Payment method */}
        <fieldset className="rounded-xl border p-4">
          <legend className="text-sm font-medium px-1">Payment method</legend>
          <div className="mt-3 grid gap-2">
            <label className="flex items-center justify-between gap-2 text-sm">
              <span>PayPal</span>
              <input type="radio" name="method" value="paypal" checked={method === "paypal"} onChange={() => setMethod("paypal")} />
            </label>
            <label className="flex items-center justify-between gap-2 text-sm">
              <span>Zelle (manual confirm)</span>
              <input type="radio" name="method" value="zelle" checked={method === "zelle"} onChange={() => setMethod("zelle")} />
            </label>
            <label className="flex items-center justify-between gap-2 text-sm">
              <span>MMG (QR)</span>
              <input type="radio" name="method" value="mmg" checked={method === "mmg"} onChange={() => setMethod("mmg")} />
            </label>
            <label className="flex items-center justify-between gap-2 text-sm">
              <span>Bank transfer (EFT/RTGS)</span>
              <input type="radio" name="method" value="bank" checked={method === "bank"} onChange={() => setMethod("bank")} />
            </label>
          </div>
        </fieldset>

        {/* Promo */}
        <div className="grid gap-2">
          <label className="text-sm">Promo code</label>
          <input value={promo} onChange={(e) => setPromo(e.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm" />
          <p className="text-xs text-muted-foreground">Use <b>GYA-LAUNCH</b> for 50% off first 2 months (Business).</p>
        </div>

        {/* Summary */}
        <div className="rounded-xl border p-4 bg-card text-sm">
          <div className="flex items-center justify-between"><span>Subtotal</span><span>{formatGYD(base)}</span></div>
          <div className="flex items-center justify-between"><span>Discount</span><span>− {formatGYD(discount)}</span></div>
          <div className="mt-2 border-t pt-2 flex items-center justify-between font-medium">
            <span>Total due today</span><span>{formatGYD(final)}</span>
          </div>
        </div>

        <button disabled={submitting || plan === "enterprise"} className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium disabled:opacity-60">
          {plan === "enterprise" ? "Contact sales" : submitting ? "Processing…" : "Proceed"}
        </button>
      </form>
    </section>
  );
}
