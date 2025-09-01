import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });
  const userId = session.user.id;
  const userOrg = await prisma.userOrg.findFirst({
    where: { userId },
    select: { orgId: true }
  });
  if (!userOrg) return new NextResponse("No organization", { status: 400 });
  const invoiceLines = await prisma.invoiceLine.findMany({
    where: { invoice: { orgId: userOrg.orgId } },
    include: { taxCode: true }
  });
  const billLines = await prisma.billLine.findMany({
    where: { bill: { orgId: userOrg.orgId } },
    include: { taxCode: true }
  });
  let outputVat = 0;
  for (const line of invoiceLines) {
    if (!line.taxCode) continue;
    const base = Number(line.unitPrice) * line.quantity;
    outputVat += base * line.taxCode.rate;
  }
  let inputVat = 0;
  for (const line of billLines) {
    if (!line.taxCode) continue;
    const base = Number(line.unitCost) * line.quantity;
    inputVat += base * line.taxCode.rate;
  }
  const netVat = outputVat - inputVat;
  return NextResponse.json({ outputVat, inputVat, netVat });
}
