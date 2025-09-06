import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { leaveDemo } from "@/lib/demo";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return NextResponse.json(
    { error: "Use POST /api/demo/leave while authenticated." },
    { status: 405 }
  );
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  await leaveDemo();
  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? null,
      action: "demo.leave",
      targetType: "User",
      targetId: session.user.id,
      metadata: {},
    },
  });
  return NextResponse.json({ ok: true, redirect: "/dashboard" });
}

