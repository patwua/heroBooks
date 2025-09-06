import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  isDemoSession,
  demoReadWhere,
  withDemoWrite,
  resolveActiveOrgId,
  purgeExpiredDemoDataIfAny,
} from "@/lib/demo";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });
  if (await isDemoSession(session)) {
    await purgeExpiredDemoDataIfAny();
    const where = await demoReadWhere(session);
    const data = await prisma.customer.findMany({ where, orderBy: { name: "asc" } });
    return NextResponse.json(data);
  }
  const orgId = await resolveActiveOrgId(session);
  if (!orgId) return new NextResponse("No organization", { status: 400 });
  const customers = await prisma.customer.findMany({ where: { orgId }, orderBy: { name: "asc" } });
  return NextResponse.json(customers);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });
  const body = await req.json();
  if (await isDemoSession(session)) {
    await purgeExpiredDemoDataIfAny();
    const data = await prisma.customer.create({ data: await withDemoWrite(session, body) });
    return NextResponse.json({ ...data, demo: true });
  }
  const orgId = await resolveActiveOrgId(session);
  if (!orgId) return new NextResponse("No organization", { status: 400 });
  const data = await prisma.customer.create({ data: { ...body, orgId } });
  return NextResponse.json(data);
}

