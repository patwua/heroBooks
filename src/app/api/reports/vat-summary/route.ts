import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const userOrg = await prisma.userOrg.findFirst({
    where: { userId: session.user.id },
    select: { orgId: true }
  });
  if (!userOrg) return new NextResponse("No organization", { status: 400 });
  const lines = await prisma.invoiceLine.findMany({
    where: { invoice: { orgId: userOrg.orgId } },
    include: { taxCode: true }
  });
  const summary: Record<string, number> = {};
  for (const line of lines) {
    if (!line.taxCode) continue;
    const base = Number(line.unitPrice) * line.quantity;
    const vat = base * line.taxCode.rate;
    summary[line.taxCode.name] = (summary[line.taxCode.name] || 0) + vat;
  }
  return NextResponse.json(summary);
}
