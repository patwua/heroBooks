import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_VAT_CODES } from "@/lib/defaultVatCodes";

export async function POST() {
  const session = await auth();
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  const existing = await prisma.userOrg.findFirst({
    where: { userId },
    include: { org: { include: { taxCodes: true } } }
  });
  if (existing) {
    return NextResponse.json(existing.org);
  }

  const org = await prisma.org.create({
    data: {
      name: "Demo Org",
      taxCodes: { create: DEFAULT_VAT_CODES }
    },
    include: { taxCodes: true }
  });

  await prisma.userOrg.create({
    data: {
      userId,
      orgId: org.id,
      role: "OWNER"
    }
  });

  return NextResponse.json(org);
}
