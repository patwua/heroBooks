import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface BillLineInput {
  description: string;
  quantity: number;
  unitCost: number;
  taxCodeId?: string;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const userOrg = await prisma.userOrg.findFirst({
    where: { userId: session.user.id },
    select: { orgId: true }
  });
  if (!userOrg) return new NextResponse("No organization", { status: 400 });
  const bills = await prisma.bill.findMany({
    where: { orgId: userOrg.orgId },
    include: { vendor: true, lines: { include: { taxCode: true } } }
  });
  const result = bills.map((b) => {
    let base = 0;
    let vat = 0;
    for (const line of b.lines) {
      const lineBase = Number(line.unitCost) * line.quantity;
      base += lineBase;
      if (line.taxCode) {
        vat += lineBase * line.taxCode.rate;
      }
    }
    return { ...b, total: base + vat, inputVat: vat };
  });
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const userOrg = await prisma.userOrg.findFirst({
    where: { userId: session.user.id },
    select: { orgId: true }
  });
  if (!userOrg) return new NextResponse("No organization", { status: 400 });
  const body = await req.json();
  const { vendorId, lines, whtRate }: { vendorId: string; lines: BillLineInput[]; whtRate?: number } = body;

  const vendor = await prisma.vendor.findFirst({
    where: { id: vendorId, orgId: userOrg.orgId },
    select: { id: true }
  });
  if (!vendor) {
    return new NextResponse("Not found", { status: 404 });
  }

  const formattedLines: any[] = [];
  for (const l of lines) {
    let taxCodeId: string | undefined = undefined;
    if (l.taxCodeId) {
      const tc = await prisma.taxCode.findFirst({
        where: { id: l.taxCodeId, orgId: userOrg.orgId },
        select: { id: true }
      });
      if (!tc) {
        return new NextResponse("Not found", { status: 404 });
      }
      taxCodeId = tc.id;
    }
    formattedLines.push({
      description: l.description,
      quantity: l.quantity,
      unitCost: new Prisma.Decimal(l.unitCost),
      taxCodeId
    });
  }

  const bill = await prisma.bill.create({
    data: {
      orgId: userOrg.orgId,
      vendorId: vendor.id,
      wht: whtRate ? new Prisma.Decimal(whtRate) : undefined,
      lines: { create: formattedLines }
    },
    include: { vendor: true, lines: { include: { taxCode: true } } }
  });
  let base = 0;
  let vat = 0;
  for (const line of bill.lines) {
    const lineBase = Number(line.unitCost) * line.quantity;
    base += lineBase;
    if (line.taxCode) {
      vat += lineBase * line.taxCode.rate;
    }
  }
  const wht = whtRate ? base * whtRate : 0;
  return NextResponse.json({ ...bill, total: base + vat, inputVat: vat, wht });
}
