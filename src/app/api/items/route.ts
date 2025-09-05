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
    const data = await prisma.item.findMany({ where, orderBy: { name: "asc" } });
    return NextResponse.json(data);
  }
  const orgId = await resolveActiveOrgId(session);
  const items = await prisma.item.findMany({ where: { orgId }, orderBy: { name: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });
  const body = await req.json();
  if (await isDemoSession(session)) {
    await purgeExpiredDemoDataIfAny();
    const data = await prisma.item.create({ data: await withDemoWrite(session, body) });
    return NextResponse.json({ ...data, demo: true });
  }
  const orgId = await resolveActiveOrgId(session);
  const data = await prisma.item.create({ data: { ...body, orgId } });
  return NextResponse.json(data);
}

