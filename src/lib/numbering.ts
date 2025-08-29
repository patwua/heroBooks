import { prisma } from "@/lib/prisma";

export async function receiptNumber() {
  const last = await prisma.payment.findFirst({
    orderBy: { receiptNumber: "desc" },
    select: { receiptNumber: true }
  });
  return (last?.receiptNumber ?? 0) + 1;
}
