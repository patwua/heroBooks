import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveOrgId } from "@/lib/features";

function ym(d: Date) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const orgId = await getActiveOrgId();
  if (!orgId)
    return NextResponse.json({ ok: false, error: "No active org" }, { status: 400 });

  const now = new Date();
  const from6 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));

  // Income = Payments.amount (received) by month
  const pays = await prisma.payment.findMany({
    where: { orgId, date: { gte: from6 } as any },
    select: { amount: true, date: true },
  });

  // Expenses from bill lines
  const billLines = await prisma.billLine.findMany({
    where: { orgId, bill: { billDate: { gte: from6 } as any } },
    select: { quantity: true, unitCost: true, bill: { select: { billDate: true } } },
  });
  const billsTotals = billLines.map((l: any) => ({
    total: Number(l.unitCost) * (l.quantity || 1),
    date: l.bill.billDate,
  }));

  // Wages = Payslip.gross by month
  let wages: { gross: number; period: Date }[] = [];
  try {
    const slips = await prisma.payslip.findMany({
      where: { orgId, period: { gte: from6 } as any },
      select: { gross: true, period: true },
    });
    wages = slips.map((s) => ({ gross: Number(s.gross), period: s.period }));
  } catch {}

  const months = new Map<string, { income: number; expense: number; wages: number }>();
  for (let i = 0; i < 6; i++) {
    const d = new Date(Date.UTC(from6.getUTCFullYear(), from6.getUTCMonth() + i, 1));
    months.set(ym(d), { income: 0, expense: 0, wages: 0 });
  }

  pays.forEach((p) => {
    const key = ym(new Date(p.date));
    if (months.has(key)) months.get(key)!.income += Number(p.amount);
  });
  billsTotals.forEach((b) => {
    const key = ym(new Date(b.date));
    if (months.has(key)) months.get(key)!.expense += Number(b.total);
  });
  wages.forEach((w) => {
    const key = ym(new Date(w.period));
    if (months.has(key)) months.get(key)!.wages += Number(w.gross);
  });

  // KPIs (MTD)
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const mtdIncome = pays
    .filter((p) => new Date(p.date) >= startOfMonth)
    .reduce((a, b) => a + Number(b.amount), 0);
  const mtdExpense = billsTotals
    .filter((b) => new Date(b.date) >= startOfMonth)
    .reduce((a, b) => a + Number(b.total), 0);
  const mtdWages = wages
    .filter((w) => new Date(w.period) >= startOfMonth)
    .reduce((a, b) => a + Number(b.gross), 0);

  // Outstanding invoices (status != paid)
  let outstanding = 0;
  try {
    const invs = await prisma.invoice.findMany({
      where: { orgId, status: { not: "paid" } },
      select: {
        lines: {
          select: {
            quantity: true,
            unitPrice: true,
            taxCode: { select: { rate: true } },
          },
        },
      },
    });
    outstanding = invs.reduce(
      (sum, inv) =>
        sum +
        inv.lines.reduce(
          (s, l) => s + Number(l.unitPrice) * (l.quantity || 1) * (1 + Number(l.taxCode?.rate || 0)),
          0,
        ),
      0,
    );
  } catch {}

  return NextResponse.json({
    ok: true,
    data: {
      months: Array.from(months.entries()).map(([month, v]) => ({ month, ...v })),
      kpis: { mtdIncome, mtdExpense, mtdWages, outstanding },
    },
  });
}
