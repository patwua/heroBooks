import { type Plan } from "./plans";

const PLAN_PRICES: Record<Plan, number> = {
  starter: 0,
  business: 9900,
  enterprise: 0,
};

export function getPlanPriceGyd(plan: Plan): number {
  return PLAN_PRICES[plan] ?? 0;
}

export function applyPromo(amount: number, promoCode?: string) {
  const code = (promoCode ?? "").trim().toUpperCase();
  if (amount > 0 && code === "GYA-LAUNCH") {
    const discountAmount = Math.round(amount * 0.5);
    const finalAmount = amount - discountAmount;
    return { finalAmount, discountAmount, promoApplied: code };
  }
  return { finalAmount: amount, discountAmount: 0, promoApplied: undefined };
}

