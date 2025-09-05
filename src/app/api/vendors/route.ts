import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
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
  const vendors = await prisma.vendor.findMany({
    where: { orgId: userOrg.orgId }
  });
  return NextResponse.json(vendors);
}

export async function POST(req: Request) {
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
  const body = await req.json();
  const { name } = body;
  if (!name) {
    return new NextResponse("Name required", { status: 400 });
  }
  const vendor = await prisma.vendor.create({
    data: { orgId: userOrg.orgId, name }
  });
  return NextResponse.json(vendor);
}
