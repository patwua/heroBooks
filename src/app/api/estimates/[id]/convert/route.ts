import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { invoiceNumber } from "@/lib/numbering";
import { calcLines } from "@/lib/vatCalc";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;
  const estimate = await prisma.estimate.findFirst({
    where: { id, orgId: userOrg.orgId },
    include: { lines: true }
  });
  if (!estimate) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (estimate.status === "converted") {
    return new NextResponse("Already converted", { status: 400 });
  }

  const number = await invoiceNumber();

  const invoice = await prisma.invoice.create({
    data: {
      orgId: userOrg.orgId,
      customerId: estimate.customerId,
      number,
      lines: {
        create: estimate.lines.map((l) => ({
          description: l.description,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          taxCodeId: l.taxCodeId
        }))
      }
    },
    include: { lines: true, customer: true }
  });

  await prisma.estimate.update({
    where: { id: estimate.id },
    data: { status: "converted" }
  });

  const vatInputs = await Promise.all(
    estimate.lines.map(async (l) => {
      let rate = 0;
      if (l.taxCodeId) {
        const tc = await prisma.taxCode.findFirst({
          where: { id: l.taxCodeId, orgId: userOrg.orgId },
          select: { rate: true }
        });
        rate = tc?.rate ?? 0;
      }
      return {
        quantity: l.quantity,
        unitPrice: parseFloat(l.unitPrice.toString()),
        taxRate: rate
      };
    })
  );
  const totals = calcLines(vatInputs);

  return NextResponse.json({ ...invoice, subTotal: totals.subTotal, vatTotal: totals.vatTotal, total: totals.total });
}
