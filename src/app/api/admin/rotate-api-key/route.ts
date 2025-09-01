import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
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
  const apiKey = randomBytes(16).toString("hex");
  await prisma.orgSettings.upsert({
    where: { orgId: userOrg.orgId },
    update: { apiKey },
    create: { orgId: userOrg.orgId, apiKey }
  });
  return NextResponse.json({ apiKey });
}
