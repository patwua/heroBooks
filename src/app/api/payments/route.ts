import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { receiptNumber } from "@/lib/numbering";
import { notifyWebhook } from "@/lib/webhooks";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const PaymentSchema = z.object({
  invoiceId: z.string(),
  amount: z.number().positive(),
  method: z.string()
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userOrg = await prisma.userOrg.findFirst({
    where: { userId: session.user.id },
    select: { orgId: true }
  });
  if (!userOrg) {
    return new NextResponse("No organization", { status: 400 });
  }

  const body = await req.json();
  const parsed = PaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(parsed.error.flatten(), { status: 400 });
  }

  const { invoiceId, amount, method } = parsed.data;
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, orgId: userOrg.orgId }
  });
  if (!invoice) {
    return new NextResponse("Not found", { status: 404 });
  }

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
  await notifyWebhook(invoice.orgId, "payment.created", payment);
  return NextResponse.json({ paymentId: payment.id, receiptNumber: number, status: "paid" });
}
