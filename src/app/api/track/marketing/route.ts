import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/** POST { event: string; meta?: Record<string, unknown> } */
export async function POST(req: Request) {
  const session = await auth();
  const { event, meta } = await req.json().catch(() => ({}));
  if (!event) return NextResponse.json({ error: "event-required" }, { status: 400 });

  await prisma.auditLog.create({
    data: {
      actorId: session?.user?.id ?? null,
      actorEmail: session?.user?.email ?? null,
      action: `marketing.${String(event)}`,
      targetType: "Marketing",
      targetId: "site",
      metadata: meta ?? {},
    },
  });

  return NextResponse.json({ ok: true });
}
