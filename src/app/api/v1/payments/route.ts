import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orgFromApiKey } from "@/lib/apiAuth";
import { notifyWebhook } from "@/lib/webhooks";
import { receiptNumber } from "@/lib/numbering";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  const apiKey = auth?.replace("Bearer ", "") || null;
  const org = await orgFromApiKey(apiKey);
  if (!org) return new NextResponse("Unauthorized", { status: 401 });
  const { invoiceId, amount, method } = await req.json();
  const invoice = await prisma.invoice.findFirst({ where: { id: invoiceId, orgId: org.id } });
  if (!invoice) return new NextResponse("Invalid invoice", { status: 400 });
  const number = await receiptNumber();
  const payment = await prisma.payment.create({
    data: {
      invoiceId,
      amount: new Prisma.Decimal(amount),
      method,
      receiptNumber: number
    }
  });
  await prisma.invoice.update({ where: { id: invoiceId }, data: { status: "paid" } });
  await notifyWebhook(org.id, "payment.created", payment);
  return NextResponse.json({ paymentId: payment.id, receiptNumber: number, status: "paid" });
}
