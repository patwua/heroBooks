import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const row = await prisma.userSettings.findUnique({ where: { userId: session.user.id } });
  return NextResponse.json({ ok: true, data: { hideLockedFeatures: row?.hideLockedFeatures ?? false } });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const { hideLockedFeatures } = await req.json();
  const row = await prisma.userSettings.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, hideLockedFeatures: !!hideLockedFeatures },
    update: { hideLockedFeatures: !!hideLockedFeatures },
  });
  return NextResponse.json({ ok: true, data: row });
}

