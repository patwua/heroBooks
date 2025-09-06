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

export async function getActiveOrgId(): Promise<string | null> {
  const session = await auth();
  return (session as any)?.orgId ?? null;
}

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

export type FeatureStatus = {
  allowed: boolean;
  reason: "ok" | "toggle" | "plan" | "super";
};

export async function getFeatureStatus(
  feature: PlatformFeature,
  orgId: string | null,
): Promise<FeatureStatus> {
  if (await isSuperUser()) return { allowed: true, reason: "super" };

  const plan = await getOrgPlan(orgId);
  const planAllows = PLAN_FEATURES[plan]?.includes(feature) ?? false;
  if (!planAllows) return { allowed: false, reason: "plan" };

  const t = await getOrgTaxFeature(orgId);

  // If no row, default VAT enabled; others disabled
  if (!t) {
    if (feature === "vat") return { allowed: true, reason: "ok" };
    if (feature === "payroll" || feature === "paye" || feature === "nis")
      return { allowed: false, reason: "toggle" };
    return { allowed: false, reason: "toggle" };
  }

  if (feature === "vat")
    return { allowed: !!t.enableVAT, reason: t.enableVAT ? "ok" : "toggle" };
  if (feature === "paye")
    return { allowed: !!t.enablePAYE, reason: t.enablePAYE ? "ok" : "toggle" };
  if (feature === "nis")
    return { allowed: !!t.enableNIS, reason: t.enableNIS ? "ok" : "toggle" };
  if (feature === "payroll")
    return {
      allowed: !!(t.enablePAYE || t.enableNIS),
      reason: t.enablePAYE || t.enableNIS ? "ok" : "toggle",
    };
  if (feature === "propertyTax")
    return { allowed: !!t.enablePropTax, reason: t.enablePropTax ? "ok" : "toggle" };

  return { allowed: false, reason: "toggle" };
}

export async function getFeatureStatuses(
  features: PlatformFeature[],
  orgId: string | null,
) {
  const entries = await Promise.all(
    features.map(async (f) => [f, await getFeatureStatus(f, orgId)] as const),
  );
  return Object.fromEntries(entries) as Record<PlatformFeature, FeatureStatus>;
}

export async function canUseFeature(
  feature: PlatformFeature,
  orgId: string | null,
): Promise<boolean> {
  const status = await getFeatureStatus(feature, orgId);
  return status.allowed;
}
