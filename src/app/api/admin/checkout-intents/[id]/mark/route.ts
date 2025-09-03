import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { activateSubscriptionFromIntent } from "@/lib/subscriptions/activate";
import { sendReceiptEmail } from "@/lib/subscriptions/email";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.reason }, { status: 403 });

  const id = params.id;
  const { status, note } = await req.json();
  if (!["paid", "failed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "invalid-status" }, { status: 400 });
  }

  const intentBefore = await prisma.checkoutIntent.findFirst({
    where: { id, orgId: gate.orgId },
  });
  if (!intentBefore) return NextResponse.json({ error: "not-found" }, { status: 404 });

  await prisma.checkoutIntent.update({
    where: { id },
    data: { status },
  });

  await prisma.auditLog.create({
    data: {
      actorId: gate.user?.id ?? null,
      actorEmail: gate.user?.email ?? null,
      action: "checkout.intent.updated",
      targetType: "CheckoutIntent",
      targetId: id,
      metadata: { from: intentBefore.status, to: status, note: note ?? null },
    },
  });

  if (status === "paid") {
    await activateSubscriptionFromIntent(id);
    await sendReceiptEmail(id);
  }

  return NextResponse.json({ ok: true });
}
