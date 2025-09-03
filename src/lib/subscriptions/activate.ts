import { prisma } from "@/lib/prisma";
import { addMonths, startOfDay } from "date-fns";

/**
 * Idempotent activation:
 * - Ensures CheckoutIntent is 'paid' before activating
 * - If user has exactly one org → attach subscription to that org
 * - Else create subscription with status 'pending_assignment' (manual follow-up)
 * Returns the subscription id (or existing one if already present).
 */
export async function activateSubscriptionFromIntent(intentId: string) {
  const intent = await prisma.checkoutIntent.findUnique({
    where: { id: intentId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          memberships: { select: { orgId: true } },
        },
      },
    },
  });
  if (!intent) throw new Error("Intent not found");

  // nothing to do if not paid
  if (intent.status !== "paid") {
    // soft-allow: no throw; just return null
    return null;
  }

  // Determine orgId (single membership → auto; else pending assignment)
  const orgIds: string[] = intent.user.memberships?.map((m: { orgId: string }) => m.orgId) ?? [];
  const orgId = orgIds.length === 1 ? orgIds[0] : null;
  const status = orgId ? "active" : "pending_assignment";

  // Compute 1-month period (simple monthly plan; adjust for annual later)
  const now = new Date();
  const periodStart = startOfDay(now);
  const periodEnd = startOfDay(addMonths(now, 1));

  // Create the subscription if it doesn't exist yet (idempotent via unique checkoutIntentId)
  const sub = await prisma.orgSubscription.upsert({
    where: { checkoutIntentId: intent.id },
    create: {
      orgId,
      plan: intent.plan,
      status,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      checkoutIntentId: intent.id,
    },
    update: {},
    select: { id: true },
  });

  // Audit
  await prisma.auditLog.create({
    data: {
      actorId: null,
      actorEmail: null,
      action: "subscription.activated",
      targetType: "OrgSubscription",
      targetId: sub.id,
      metadata: {
        fromIntent: intent.id,
        plan: intent.plan,
        amountGYD: intent.amount,
        paymentMethod: intent.paymentMethod,
        orgAttached: orgId ? true : false,
      },
    },
  });

  return sub.id;
}
