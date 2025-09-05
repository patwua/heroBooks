// Updated to route to paypal|zelle|mmg|bank only
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizePlan, type Plan } from "@/lib/plans";
import { getPlanPriceGyd, applyPromo } from "@/lib/pricing";
import { getProviderOrThrow } from "@/lib/payments";
import { getActiveOrgId } from "@/lib/tenant";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan: rawPlan, promoCode, paymentMethod = "paypal" } = await req.json?.() ?? {};
  const plan: Plan = normalizePlan(rawPlan);
  if (plan === "enterprise") return NextResponse.json({ error: "Contact sales for Enterprise" }, { status: 400 });

  const baseAmount = getPlanPriceGyd(plan);
  const { finalAmount, discountAmount, promoApplied } = applyPromo(baseAmount, promoCode);

  const orgId = await getActiveOrgId();

  const intent = await prisma.checkoutIntent.create({
    data: {
      userId: session.user.id,
      orgId,
      plan,
      amount: finalAmount,
      discount: discountAmount,
      promoCode: promoApplied ?? null,
      status: "created",
      paymentMethod,
    },
  });

  const provider = getProviderOrThrow(String(paymentMethod));
  const res = await provider.createCheckout({
    intentId: intent.id,
    amountGYD: finalAmount,
    description: `heroBooks ${plan} plan`,
    returnUrl: `${process.env.NEXTAUTH_URL}/checkout/confirm`,
    metadata: { plan },
  });

  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 400 });

  if (res.externalRef) {
    await prisma.checkoutIntent.update({
      where: { id: intent.id },
      data: { externalRef: res.externalRef, status: "processing" },
    });
  } else {
    await prisma.checkoutIntent.update({
      where: { id: intent.id },
      data: { status: "processing" },
    });
  }

  return NextResponse.json({ ok: true, redirectUrl: res.redirectUrl });
}
