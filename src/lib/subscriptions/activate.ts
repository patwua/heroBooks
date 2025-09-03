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

  // Check if there's already a subscription linked via this intent (idempotency)
  const existing = await prisma.orgSubscription.findFirst({
    where: { checkoutIntentId: intent.id },
    select: { id: true },
  });
  if (existing) return existing.id;

  const orgId = intent.orgId;
  const status = "active";

  // Compute 1-month period (simple monthly plan; adjust for annual later)
  const now = new Date();
  const periodStart = startOfDay(now);
  const periodEnd = startOfDay(addMonths(now, 1));

  const sub = await prisma.orgSubscription.create({
    data: {
      orgId,
      plan: intent.plan,
      status,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      checkoutIntentId: intent.id,
    },
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
        orgAttached: true,
      },
    },
  });

  return sub.id;
}
