import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { cache } from "react";

export type PlatformFeature =
  | "vat"
  | "payroll" // umbrella for PAYE/NIS
  | "paye"
  | "nis"
  | "propertyTax"
  | "advancedReports";

export type PlanName = "free" | "starter" | "business" | "enterprise";

const SUPER = (process.env.SUPERUSER_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

// ---- Feature Registry ----
export type FeatureMeta = {
  key: PlatformFeature;
  label: string;
  route: string; // primary page
  group: "accounting" | "reports" | "settings";
};

export const FEATURE_REGISTRY: FeatureMeta[] = [
  { key: "vat", label: "VAT", route: "/reports/vat", group: "reports" },
  { key: "payroll", label: "Payroll", route: "/payroll", group: "accounting" },
  { key: "paye", label: "PAYE", route: "/payroll", group: "accounting" },
  { key: "nis", label: "NIS", route: "/payroll", group: "accounting" },
  { key: "propertyTax", label: "Property Tax", route: "/reports/property-tax", group: "reports" },
  { key: "advancedReports", label: "Advanced Reports", route: "/reports/advanced", group: "reports" },
];

// ---- Plans ----
const PLAN_FEATURES: Record<PlanName, PlatformFeature[]> = {
  free: ["vat"],
  starter: ["vat"],
  business: ["vat", "payroll", "paye", "nis", "advancedReports"],
  enterprise: ["vat", "payroll", "paye", "nis", "advancedReports", "propertyTax"],
};

// ---- Session helpers ----
export const getActiveOrgId = cache(async () => {
  const session = await auth();
  return (session as any)?.orgId ?? null;
});

export async function isSuperUser(): Promise<boolean> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  return !!(email && SUPER.includes(email));
}

export const getOrgTaxFeature = cache(async (orgId: string | null) => {
  if (!orgId) return null;
  return prisma.orgTaxFeature.findUnique({ where: { orgId } });
});

export const getOrgPlan = cache(async (orgId: string | null): Promise<PlanName> => {
  // TODO: plug real subscription; default business
  return "business";
});

export type FeatureStatus = { allowed: boolean; reason: "ok" | "toggle" | "plan" | "super" };

// Unified reason → human text for badges/tooltips
export function reasonText(reason: FeatureStatus["reason"]): string {
  if (reason === "plan") return "Upgrade required";
  if (reason === "toggle") return "Activation required";
  if (reason === "super") return "Granted (superuser)";
  return "Available";
}

export async function getFeatureStatus(feature: PlatformFeature, orgId: string | null): Promise<FeatureStatus> {
  if (await isSuperUser()) return { allowed: true, reason: "super" };

  const plan = await getOrgPlan(orgId);
  const planAllows = PLAN_FEATURES[plan]?.includes(feature) ?? false;
  if (!planAllows) return { allowed: false, reason: "plan" };

  const t = await getOrgTaxFeature(orgId);
  if (!t) {
    if (feature === "vat") return { allowed: true, reason: "ok" };
    if (feature === "payroll" || feature === "paye" || feature === "nis") return { allowed: false, reason: "toggle" };
    return { allowed: false, reason: "toggle" };
  }

  if (feature === "vat") return { allowed: !!t.enableVAT, reason: t.enableVAT ? "ok" : "toggle" };
  if (feature === "paye") return { allowed: !!t.enablePAYE, reason: t.enablePAYE ? "ok" : "toggle" };
  if (feature === "nis") return { allowed: !!t.enableNIS, reason: t.enableNIS ? "ok" : "toggle" };
  if (feature === "payroll")
    return { allowed: !!(t.enablePAYE || t.enableNIS), reason: t.enablePAYE || t.enableNIS ? "ok" : "toggle" };
  if (feature === "propertyTax")
    return { allowed: !!t.enablePropTax, reason: t.enablePropTax ? "ok" : "toggle" };

  // advancedReports has no toggle, plan-only
  if (feature === "advancedReports") return { allowed: true, reason: "ok" };

  return { allowed: false, reason: "toggle" };
}

export async function getFeatureStatuses(features: PlatformFeature[], orgId: string | null) {
  const entries = await Promise.all(features.map(async (f) => [f, await getFeatureStatus(f, orgId)] as const));
  return Object.fromEntries(entries) as Record<PlatformFeature, FeatureStatus>;
}

// ---- User UI settings ----
export const getUserUiSettings = cache(async () => {
  const session = await auth();
  const userId = session?.user?.id || null;
  if (!userId) return { hideLockedFeatures: false };
  const row = await prisma.userSettings.findUnique({ where: { userId } });
  return { hideLockedFeatures: row?.hideLockedFeatures ?? false };
});

export async function canUseFeature(feature: PlatformFeature, orgId: string | null): Promise<boolean> {
  const status = await getFeatureStatus(feature, orgId);
  return status.allowed;
}

