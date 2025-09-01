import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { url } = await req.json();
  const userId = (session.user as { id: string }).id;
  const userOrg = await prisma.userOrg.findFirst({
    where: { userId },
    select: { orgId: true }
  });
  if (!userOrg) {
    return new NextResponse("No organization", { status: 400 });
  }
  await prisma.orgSettings.upsert({
    where: { orgId: userOrg.orgId },
    update: { webhookUrl: url },
    create: { orgId: userOrg.orgId, webhookUrl: url }
  });
  return NextResponse.json({ webhookUrl: url });
}
