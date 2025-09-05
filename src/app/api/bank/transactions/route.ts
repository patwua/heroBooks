import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  isDemoSession,
  demoReadWhere,
  resolveActiveOrgId,
  purgeExpiredDemoDataIfAny,
} from "@/lib/demo";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  if (await isDemoSession(session)) {
    await purgeExpiredDemoDataIfAny();
    const where = await demoReadWhere(session);
    const transactions = await prisma.bankTransaction.findMany({
      where,
      orderBy: { date: "desc" },
      take: 50,
    });
    return NextResponse.json(transactions);
  }
  const orgId = await resolveActiveOrgId(session);
  if (!orgId) {
    return new NextResponse("No organization", { status: 400 });
  }
  const transactions = await prisma.bankTransaction.findMany({
    where: { orgId },
    orderBy: { date: "desc" },
    take: 50,
  });
  return NextResponse.json(transactions);
}

