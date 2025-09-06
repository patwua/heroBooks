import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ORG_COOKIE_NAME } from "@/lib/tenant";

/** Returns "starter" | "business" | "enterprise" | "none" | "pending_assignment" */
export async function getCurrentPlanForActiveOrg(): Promise<string> {
  const orgId = cookies().get(ORG_COOKIE_NAME)?.value;
  if (!orgId) return "none";

  const sub = await prisma.orgSubscription.findFirst({
    where: { orgId, status: { in: ["active", "pending_assignment"] } },
    orderBy: { createdAt: "desc" },
    select: { plan: true, status: true },
  });
  if (!sub) return "none";
  if (sub.status === "pending_assignment") return "pending_assignment";
  return sub.plan;
}

