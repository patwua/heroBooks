import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { activateSubscriptionFromIntent } from "@/lib/subscriptions/activate";
import { sendReceiptEmail } from "@/lib/subscriptions/email";

const PAYPAL_BASE =
  process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token"); // PayPal order ID
  const intentId = url.searchParams.get("intent") || "";

  if (!token || !intentId) return NextResponse.redirect(new URL(`/checkout/confirm?id=${intentId}`, url).toString());

  // Capture the order
  // We use client creds again for simplicity
  const creds = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  let captureSucceeded = false;
  try {
    const tokRes = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const { access_token } = await tokRes.json();

    const capRes = await fetch(
      `${PAYPAL_BASE}/v2/checkout/orders/${token}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const capJson = await capRes.json();

    if (capRes.ok) {
      captureSucceeded = true;
      await prisma.checkoutIntent.update({
        where: { id: intentId },
        data: { status: "paid", externalRef: token },
      });
      await prisma.auditLog.create({
        data: {
          actorId: null,
          actorEmail: null,
          action: "paypal.capture.succeeded",
          targetType: "CheckoutIntent",
          targetId: intentId,
          metadata: capJson ?? {},
        },
      });
    } else {
      await prisma.checkoutIntent.update({
        where: { id: intentId },
        data: { status: "failed" },
      });
      await prisma.auditLog.create({
        data: {
          actorId: null,
          actorEmail: null,
          action: "paypal.capture.failed",
          targetType: "CheckoutIntent",
          targetId: intentId,
          metadata: capJson ?? {},
        },
      });
      return NextResponse.redirect(new URL(`/checkout/confirm?id=${intentId}`, url).toString());
    }
  } catch (err) {
    console.error(err);
    await prisma.checkoutIntent.update({
      where: { id: intentId },
      data: { status: "failed" },
    });
    await prisma.auditLog.create({
      data: {
        actorId: null,
        actorEmail: null,
        action: "paypal.capture.failed",
        targetType: "CheckoutIntent",
        targetId: intentId,
        metadata: {
          error: err instanceof Error ? err.message : String(err),
        },
      },
    });
    return NextResponse.redirect(new URL(`/checkout/confirm?id=${intentId}`, url).toString());
  }

  try {
    // Activate + receipt (idempotent)
    await activateSubscriptionFromIntent(intentId);
    await sendReceiptEmail(intentId);
  } catch (err) {
    console.error(err);
    await prisma.auditLog.create({
      data: {
        actorId: null,
        actorEmail: null,
        action: "paypal.postprocess.failed",
        targetType: "CheckoutIntent",
        targetId: intentId,
        metadata: {
          error: err instanceof Error ? err.message : String(err),
        },
      },
    });
  }

  if (captureSucceeded) {
    try {
      // Activate + receipt (idempotent)
      await activateSubscriptionFromIntent(intentId);
      await sendReceiptEmail(intentId);
    } catch (err) {
      console.error(err);
    }
  }

  return NextResponse.redirect(new URL(`/checkout/confirm?id=${intentId}`, url).toString());
}
