import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const userOrg = await prisma.userOrg.findFirst({
    where: { userId: session.user.id },
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
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const userOrg = await prisma.userOrg.findFirst({
    where: { userId: session.user.id },
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
