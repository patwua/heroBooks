import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST() {
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

  const transactions = await prisma.bankTransaction.findMany({
    where: { orgId: userOrg.orgId, status: "UNMATCHED" }
  });

  let matched = 0;
  for (const t of transactions) {
    const start = new Date(t.date);
    start.setDate(start.getDate() - 3);
    const end = new Date(t.date);
    end.setDate(end.getDate() + 3);

    const payment = await prisma.payment.findFirst({
      where: {
        amount: t.amount,
        date: { gte: start, lte: end },
        invoice: { orgId: userOrg.orgId }
      }
    });
    if (payment) {
      await prisma.bankTransaction.update({
        where: { id: t.id },
        data: { paymentId: payment.id, invoiceId: payment.invoiceId, status: "MATCHED" }
      });
      matched++;
      continue;
    }

    const invoices = await prisma.invoice.findMany({
      where: { orgId: userOrg.orgId, issueDate: { gte: start, lte: end } },
      include: { lines: true }
    });
    const tAmount = parseFloat(t.amount.toString());
    const invoice = invoices.find((inv) => {
      const total = inv.lines.reduce(
        (s, l) => s + parseFloat(l.unitPrice.toString()) * l.quantity,
        0
      );
      return Math.abs(total - tAmount) < 0.01;
    });
    if (invoice) {
      await prisma.bankTransaction.update({
        where: { id: t.id },
        data: { invoiceId: invoice.id, status: "MATCHED" }
      });
      matched++;
      continue;
    }

    const bills = await prisma.bill.findMany({
      where: { orgId: userOrg.orgId, billDate: { gte: start, lte: end } },
      include: { lines: true }
    });
    const bill = bills.find((b) => {
      const total = b.lines.reduce(
        (s, l) => s + parseFloat(l.unitCost.toString()) * l.quantity,
        0
      );
      return Math.abs(total - Math.abs(tAmount)) < 0.01;
    });
    if (bill) {
      await prisma.bankTransaction.update({
        where: { id: t.id },
        data: { billId: bill.id, status: "MATCHED" }
      });
      matched++;
    }
  }

  return NextResponse.json({ matched });
}
