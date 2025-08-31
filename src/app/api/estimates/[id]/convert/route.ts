import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { invoiceNumber } from "@/lib/numbering";
import { calcLines } from "@/lib/vatCalc";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const userOrg = await prisma.userOrg.findFirst({
    where: { userId },
    select: { orgId: true }
  });
  if (!userOrg) {
    return new NextResponse("No organization", { status: 400 });
  }

  const estimate = await (prisma as any).estimate.findFirst({
    where: { id: params.id, orgId: userOrg.orgId },
    include: { lines: true }
  });
  if (!estimate) {
    return new NextResponse("Not found", { status: 404 });
  }

  const number = await invoiceNumber();

  const invoice = await prisma.invoice.create({
    data: {
      orgId: userOrg.orgId,
      customerId: estimate.customerId,
      number,
      lines: {
        create: (estimate.lines as any[]).map((l: any) => ({
          description: l.description,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          taxCodeId: l.taxCodeId
        }))
      }
    },
    include: { lines: true, customer: true }
  });

  await (prisma as any).estimate.update({
    where: { id: estimate.id },
    data: { status: "converted" }
  });

  const vatInputs = await Promise.all(
    (estimate.lines as any[]).map(async (l: any) => {
      let rate = 0;
      if (l.taxCodeId) {
        const tc = await prisma.taxCode.findUnique({
          where: { id: l.taxCodeId },
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
