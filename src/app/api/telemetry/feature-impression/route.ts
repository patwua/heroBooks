import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveOrgId } from "@/lib/features";

export async function POST(req: Request) {
  const session = await auth();
  const orgId = await getActiveOrgId();
  const { feature, reason, path } = await req.json();

  await prisma.telemetryEvent.create({
    data: {
      orgId: orgId || undefined,
      userId: session?.user?.id || undefined,
      email: session?.user?.email || undefined,
      feature,
      reason,
      path,
    },
  });

  return NextResponse.json({ ok: true });
}

