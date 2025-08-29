import { prisma } from "@/lib/prisma";

export async function receiptNumber() {
  const last = await prisma.payment.findFirst({
    orderBy: { receiptNumber: "desc" },
    select: { receiptNumber: true }
  });
  return (last?.receiptNumber ?? 0) + 1;
}

export async function invoiceNumber() {
  const last = await prisma.invoice.findFirst({
    orderBy: { number: "desc" },
    select: { number: true }
  });
  return (last?.number ?? 0) + 1;
}
