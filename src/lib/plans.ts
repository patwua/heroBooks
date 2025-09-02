export const PLANS = ["starter", "business", "enterprise"] as const;
export type Plan = (typeof PLANS)[number];

export function normalizePlan(input?: string | null): Plan {
  const val = (input ?? "").toLowerCase();
  if (PLANS.includes(val as Plan)) return val as Plan;
  return "business"; // sensible default for marketing CTAs
}
