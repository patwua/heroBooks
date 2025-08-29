import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { receiptNumber } from "@/lib/numbering";
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

  const body = await req.json();
  const parsed = PaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(parsed.error.flatten(), { status: 400 });
  }

  const { invoiceId, amount, method } = parsed.data;
  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) {
    return new NextResponse("Invalid invoice", { status: 400 });
  }

  const number = await receiptNumber();
  await prisma.payment.create({
    data: {
      invoiceId,
      amount: new Prisma.Decimal(amount),
      method,
      receiptNumber: number
    }
  });

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: "paid" }
  });

  return NextResponse.json({ receiptNumber: number, status: "paid" });
}
