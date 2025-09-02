import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mmgProvider } from "@/lib/payments/mmg";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const parsed = await mmgProvider.verifyAndParseWebhook?.(req, rawBody);
  if (!parsed?.ok) return NextResponse.json({ error: parsed?.error || "invalid" }, { status: 400 });

  const { intentId, status, externalRef } = parsed;
  if (!intentId) return NextResponse.json({ error: "Missing intentId" }, { status: 400 });

  await prisma.checkoutIntent.update({
    where: { id: intentId },
    data: { status: status === "paid" ? "paid" : status, externalRef: externalRef ?? undefined },
  });

  return NextResponse.json({ ok: true });
}
