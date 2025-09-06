import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { cache } from "react";

export type PlatformFeature =
  | "vat"
  | "paye"
  | "nis"
  | "payroll" // umbrella feature for PAYE/NIS screens
  | "propertyTax";

export type PlanName = "free" | "starter" | "business" | "enterprise";

const SUPER = (process.env.SUPERUSER_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

// Minimal plan => features mapping. Adjust to your pricing.
const PLAN_FEATURES: Record<PlanName, PlatformFeature[]> = {
  free: ["vat"],
  starter: ["vat"],
  business: ["vat", "payroll", "paye", "nis"],
  enterprise: ["vat", "payroll", "paye", "nis", "propertyTax"],
};

export const getActiveOrgId = cache(async () => {
  const session = await auth();
  return (session as any)?.orgId ?? null;
});

export async function isSuperUser(): Promise<boolean> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  return !!(email && SUPER.includes(email));
}

// Query org toggles
export const getOrgTaxFeature = cache(async (orgId: string | null) => {
  if (!orgId) return null;
  return prisma.orgTaxFeature.findUnique({ where: { orgId } });
});

// Fetch org plan (placeholder: extend when you have real subscription lookup)
export const getOrgPlan = cache(async (orgId: string | null): Promise<PlanName> => {
  // TODO: replace with real subscription state; default business for now
  return "business";
});

export async function canUseFeature(feature: PlatformFeature, orgId: string | null): Promise<boolean> {
  // Superuser can see everything
  if (await isSuperUser()) return true;

  // Plan gate
  const plan = await getOrgPlan(orgId);
  const planAllows = PLAN_FEATURES[plan]?.includes(feature) ?? false;
  if (!planAllows) return false;

  // Org settings gate
  const toggles = await getOrgTaxFeature(orgId);
  if (!toggles) return feature === "vat"; // VAT default true in our schema

  if (feature === "vat") return !!toggles.enableVAT;
  if (feature === "paye" || feature === "payroll")
    return !!toggles.enablePAYE || !!toggles.enableNIS; // payroll shown if either is on
  if (feature === "nis") return !!toggles.enableNIS;
  if (feature === "propertyTax") return !!toggles.enablePropTax;

  return false;
}
