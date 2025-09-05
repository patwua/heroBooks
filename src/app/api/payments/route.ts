import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { receiptNumber } from "@/lib/numbering";
import { notifyWebhook } from "@/lib/webhooks";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  isDemoSession,
  withDemoWrite,
  resolveActiveOrgId,
  purgeExpiredDemoDataIfAny,
  getDemoOrgId,
} from "@/lib/demo";

const PaymentSchema = z.object({
  invoiceId: z.string(),
  amount: z.number().positive(),
  method: z.string(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const demo = await isDemoSession(session);
  const orgId = demo ? await getDemoOrgId() : await resolveActiveOrgId(session);
  if (!orgId) {
    return new NextResponse("No organization", { status: 400 });
  }
  if (demo) {
    await purgeExpiredDemoDataIfAny();
  }

  const body = await req.json();
  const parsed = PaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(parsed.error.flatten(), { status: 400 });
  }

  const { invoiceId, amount, method } = parsed.data;
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, orgId },
  });
  if (!invoice) {
    return new NextResponse("Not found", { status: 404 });
  }

  const number = await receiptNumber();
  const data = demo
    ? await withDemoWrite(session, {
        invoiceId,
        amount: new Prisma.Decimal(amount),
        method,
        receiptNumber: number,
      })
    : {
        orgId,
        invoiceId,
        amount: new Prisma.Decimal(amount),
        method,
        receiptNumber: number,
      };

  const payment = await prisma.payment.create({ data });

  await prisma.invoice.update({ where: { id: invoiceId }, data: { status: "paid" } });
  if (!demo) await notifyWebhook(invoice.orgId, "payment.created", payment);
  return NextResponse.json({ paymentId: payment.id, receiptNumber: number, status: "paid", demo });
}

