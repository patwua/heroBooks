import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { enterDemo, getOrCreateDemoOrgId } from "@/lib/demo";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return NextResponse.json(
    { error: "Use POST /api/demo/enter while authenticated." },
    { status: 405 }
  );
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const orgId = await getOrCreateDemoOrgId();
    await enterDemo(orgId);
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        actorEmail: session.user.email ?? null,
        action: "demo.enter",
        targetType: "Org",
        targetId: orgId,
        metadata: { userId: session.user.id },
      },
    });
    // You can redirect to dashboard for a nice UX
    return NextResponse.json({ ok: true, orgId, redirect: "/dashboard" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "demo enter failed" }, { status: 500 });
  }
}

