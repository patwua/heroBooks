import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ orgs: [] }, { status: 401 });
  }

  const orgs = await prisma.userOrg.findMany({
    where: { userId: session.user.id },
    include: {
      org: { select: { id: true, name: true, theme: { select: { logoUrl: true } } } },
    },
    orderBy: { orgId: "asc" },
  });

  return NextResponse.json({
    orgs: orgs.map((o) => ({
      id: o.org.id,
      name: o.org.name,
      logoUrl: (o.org.theme?.logoUrl as string | null) ?? null,
    })),
  });
}

