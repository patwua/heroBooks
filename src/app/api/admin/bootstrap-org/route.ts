import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { DEFAULT_VAT_CODES } from "@/lib/defaultVatCodes";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const existing = await prisma.organization.findFirst({
    where: { ownerId: session.user.id }
  });
  if (existing) {
    return NextResponse.json(existing);
  }

  const org = await prisma.organization.create({
    data: {
      name: "Demo Org",
      ownerId: session.user.id,
      vatCodes: { create: DEFAULT_VAT_CODES }
    },
    include: { vatCodes: true }
  });

  return NextResponse.json(org);
}
