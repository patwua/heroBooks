"use client";

import TrackLink from "@/components/marketing/TrackLink";
import { useEffect } from "react";
import { recordFeatureImpression } from "@/lib/telemetry";

const plans = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Small teams & sole traders",
    price: "$19/mo",
    features: [
      "VAT-ready invoices & receipts",
      "Customers & vendors",
      "Bank file import (CSV/OFX)",
      "Basic reports (P&L, Balance Sheet)",
    ],
    cta: { label: "Start free setup", href: "/get-started" },
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Most Popular",
    price: "$49/mo",
    features: [
      "Everything in Starter",
      "Recurring invoices & reminders",
      "Bank rules & faster reconciliation",
      "Payroll basics: PAYE & NIS",
      "Project/job tracking (light)",
    ],
    cta: { label: "Start free setup", href: "/get-started" },
    featured: true,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Teams & multi-branch",
    price: "Custom",
    features: [
      "Everything in Growth",
      "Advanced inventory/COGS (dealers)",
      "Multi-location & roles",
      "API & integrations",
      "Priority support",
    ],
    cta: { label: "Contact sales", href: "/contact" },
  },
];

export default function PricingSection() {
  useEffect(() => {
    recordFeatureImpression({ feature: "pricing_view" });
  }, []);

  return (
    <section id="pricing" className="border-t bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold">Choose a plan that grows with you</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start simple, add tools as you scale. VAT, PAYE, and NIS are supported across all plans.
          </p>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              id={plan.id}
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border bg-background p-6 ${
                plan.featured ? "scale-105 border-emerald-500 shadow-lg" : ""
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
              <p className="mt-4 text-3xl font-extrabold">{plan.price}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {plan.features.map((f) => (
                  <li key={f}>✔ {f}</li>
                ))}
              </ul>
              <TrackLink
                href={plan.cta.href}
                event="pricing_cta_click"
                meta={{ plan_id: plan.id }}
                className={`mt-6 inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium text-white ${
                  plan.id === "pro"
                    ? "bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {plan.cta.label}
              </TrackLink>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          All plans support Guyana VAT. Prices exclude applicable taxes. Cancel anytime.
        </p>
      </div>
    </section>
  );
}

