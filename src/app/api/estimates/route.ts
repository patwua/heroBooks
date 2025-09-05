import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcLines, nextDocNumber } from "@/lib/vatCalc";
import { Prisma } from "@prisma/client";

interface EstimateItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
  taxCodeId?: string;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const userId = session.user.id;
  const userOrg = await prisma.userOrg.findFirst({
    where: { userId },
    select: { orgId: true }
  });
  if (!userOrg) {
    return new NextResponse("No organization", { status: 400 });
  }
  const estimates = await prisma.estimate.findMany({
    where: { orgId: userOrg.orgId },
    include: { customer: true }
  });
  return NextResponse.json(estimates);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const userId = session.user.id;
  const userOrg = await prisma.userOrg.findFirst({
    where: { userId },
    select: { orgId: true }
  });
  if (!userOrg) {
    return new NextResponse("No organization", { status: 400 });
  }
  const body = await req.json();
  const { customerId, items }: { customerId: string; items: EstimateItemInput[] } = body;

  const customer = await prisma.customer.findFirst({
    where: { id: customerId, orgId: userOrg.orgId },
    select: { id: true }
  });
  if (!customer) {
    return new NextResponse("Not found", { status: 404 });
  }

  const number = await nextDocNumber("EST", "estimate");

  const vatInputs: { quantity: number; unitPrice: number; taxRate: number }[] = [];
  const lines: any[] = [];
  for (const item of items) {
    let rate = 0;
    let taxCodeId: string | undefined = undefined;
    if (item.taxCodeId) {
      const tc = await prisma.taxCode.findFirst({
        where: { id: item.taxCodeId, orgId: userOrg.orgId },
        select: { id: true, rate: true }
      });
      if (!tc) {
        return new NextResponse("Not found", { status: 404 });
      }
      rate = tc.rate;
      taxCodeId = tc.id;
    }
    vatInputs.push({ quantity: item.quantity, unitPrice: item.unitPrice, taxRate: rate });
    lines.push({
      description: item.description,
      quantity: item.quantity,
      unitPrice: new Prisma.Decimal(item.unitPrice),
      taxCodeId
    });
  }

  const totals = calcLines(vatInputs);

  const estimate = await prisma.estimate.create({
    data: {
      orgId: userOrg.orgId,
      customerId: customer.id,
      number,
      subTotal: new Prisma.Decimal(totals.subTotal),
      vatTotal: new Prisma.Decimal(totals.vatTotal),
      total: new Prisma.Decimal(totals.total),
      lines: { create: lines }
    },
    include: { lines: true, customer: true }
  });

  return NextResponse.json(estimate);
}
