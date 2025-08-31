import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
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
  const estimates = await prisma.estimate.findMany({
    where: { orgId: userOrg.orgId }
  });
  return NextResponse.json(estimates);
}

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
  const { customerId, items }: { customerId: string; items: EstimateItemInput[] } = body;

  const number = await nextDocNumber("EST", "estimate");

  const vatInputs = await Promise.all(
    items.map(async (item) => {
      let rate = 0;
      if (item.taxCodeId) {
        const tc = await prisma.taxCode.findUnique({
          where: { id: item.taxCodeId },
          select: { rate: true }
        });
        rate = tc?.rate ?? 0;
      }
      return { quantity: item.quantity, unitPrice: item.unitPrice, taxRate: rate };
    })
  );

  const totals = calcLines(vatInputs);

  const lines = items.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    unitPrice: new Prisma.Decimal(item.unitPrice),
    taxCodeId: item.taxCodeId
  }));

  const estimate = await prisma.estimate.create({
    data: {
      orgId: userOrg.orgId,
      customerId,
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
