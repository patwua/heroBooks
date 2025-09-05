import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });
  const userId = session.user.id;
  const userOrg = await prisma.userOrg.findFirst({
    where: { userId },
    select: { orgId: true }
  });
  if (!userOrg) return new NextResponse("No organization", { status: 400 });
  const invoices = await prisma.invoice.findMany({
    where: { orgId: userOrg.orgId, status: { not: "paid" } },
    include: { lines: { include: { taxCode: true } } }
  });
  const buckets: Record<string, number> = {
    current: 0,
    "31-60": 0,
    "61-90": 0,
    "90+": 0
  };
  const now = Date.now();
  for (const inv of invoices) {
    let total = 0;
    for (const line of inv.lines) {
      const base = Number(line.unitPrice) * line.quantity;
      const rate = line.taxCode ? line.taxCode.rate : 0;
      total += base + base * rate;
    }
    const due = inv.dueDate ? inv.dueDate.getTime() : inv.issueDate.getTime();
    const days = Math.floor((now - due) / (1000 * 60 * 60 * 24));
    if (days <= 30) buckets.current += total;
    else if (days <= 60) buckets["31-60"] += total;
    else if (days <= 90) buckets["61-90"] += total;
    else buckets["90+"] += total;
  }
  return NextResponse.json(buckets);
}
