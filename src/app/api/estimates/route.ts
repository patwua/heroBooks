import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";
import { calcLineVat } from "@/lib/tax/vat";

function sumEst(lines: Array<{ unitPrice: Decimal; quantity: number; taxRate: number }>) {
  const sub = lines.reduce((acc, l) => acc.add(l.unitPrice.mul(l.quantity)), new Decimal(0));
  const vat = lines.reduce((acc, l) => acc.add(calcLineVat(l.unitPrice, l.quantity, l.taxRate)), new Decimal(0));
  return { subTotal: sub, vatTotal: vat, total: sub.add(vat) };
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const orgId = (session as any).orgId || null;
  if (!orgId) return NextResponse.json({ ok: false, error: "No active org" }, { status: 400 });

  const body = await req.json();
  const { customerId, issueDate, expiryDate, status, number, lines } = body as any;

  const itemIds = (lines ?? []).map((l: any) => l.itemId).filter(Boolean);
  const items = itemIds.length ? await prisma.item.findMany({ where: { orgId, id: { in: itemIds } } }) : [];
  const itemById = new Map(items.map((i) => [i.id, i]));

  const lineCreates = (lines ?? []).map((l: any) => {
    const it = l.itemId ? itemById.get(l.itemId) : null;
    const unitPrice = l.unitPrice ? new Decimal(l.unitPrice) : new Decimal(it?.price ?? 0);
    const taxCodeId = l.taxCodeId ?? it?.taxCodeId ?? null;
    return {
      orgId,
      itemId: l.itemId ?? null,
      description: l.description ?? it?.name ?? null,
      quantity: l.quantity ?? 1,
      unitPrice,
      taxCodeId,
      _calc: { unitPrice, quantity: l.quantity ?? 1, taxRate: 0 },
    } as any;
  });

  const withRates = await Promise.all(
    lineCreates.map(async (lc: any) => {
      if (!lc.taxCodeId) return { ...lc, _calc: { ...lc._calc, taxRate: 0 } };
      const tc = await prisma.taxCode.findUnique({ where: { id: lc.taxCodeId } });
      return { ...lc, _calc: { ...lc._calc, taxRate: tc?.rate ?? 0 } };
    })
  );

  const calcInput = withRates.map((x: any) => ({ unitPrice: x._calc.unitPrice, quantity: x._calc.quantity, taxRate: x._calc.taxRate }));
  const totals = sumEst(calcInput);

  const created = await prisma.estimate.create({
    data: {
      orgId,
      number,
      customerId: customerId ?? null,
      issueDate: issueDate ? new Date(issueDate) : undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      status: status ?? undefined,
      subTotal: totals.subTotal,
      vatTotal: totals.vatTotal,
      total: totals.total,
      lines: { create: withRates.map(({ _calc, ...rest }: any) => rest) },
    },
  });

  return NextResponse.json({ ok: true, data: created });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const orgId = (session as any).orgId || null;
  if (!orgId) return NextResponse.json({ ok: false, error: "No active org" }, { status: 400 });

  const body = await req.json();
  const { id, customerId, issueDate, expiryDate, status, lines } = body as any;
  if (!id) return NextResponse.json({ ok: false, error: "Missing estimate id" }, { status: 400 });

  const itemIds = (lines ?? []).map((l: any) => l.itemId).filter(Boolean);
  const items = itemIds.length ? await prisma.item.findMany({ where: { orgId, id: { in: itemIds } } }) : [];
  const itemById = new Map(items.map((i) => [i.id, i]));

  const lineCreates = (lines ?? []).map((l: any) => {
    const it = l.itemId ? itemById.get(l.itemId) : null;
    const unitPrice = l.unitPrice ? new Decimal(l.unitPrice) : new Decimal(it?.price ?? 0);
    const taxCodeId = l.taxCodeId ?? it?.taxCodeId ?? null;
    return {
      orgId,
      itemId: l.itemId ?? null,
      description: l.description ?? it?.name ?? null,
      quantity: l.quantity ?? 1,
      unitPrice,
      taxCodeId,
      _calc: { unitPrice, quantity: l.quantity ?? 1, taxRate: 0 },
    } as any;
  });

  const withRates = await Promise.all(
    lineCreates.map(async (lc: any) => {
      if (!lc.taxCodeId) return { ...lc, _calc: { ...lc._calc, taxRate: 0 } };
      const tc = await prisma.taxCode.findUnique({ where: { id: lc.taxCodeId } });
      return { ...lc, _calc: { ...lc._calc, taxRate: tc?.rate ?? 0 } };
    })
  );

  const calcInput = withRates.map((x: any) => ({ unitPrice: x._calc.unitPrice, quantity: x._calc.quantity, taxRate: x._calc.taxRate }));
  const totals = sumEst(calcInput);

  await prisma.estimateLine.deleteMany({ where: { orgId, estimateId: id } });
  const updated = await prisma.estimate.update({
    where: { id },
    data: {
      customerId: customerId ?? undefined,
      issueDate: issueDate ? new Date(issueDate) : undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      status: status ?? undefined,
      subTotal: totals.subTotal,
      vatTotal: totals.vatTotal,
      total: totals.total,
      lines: { create: withRates.map(({ _calc, ...rest }: any) => rest) },
    },
  });

  return NextResponse.json({ ok: true, data: updated });
}
