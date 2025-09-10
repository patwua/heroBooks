import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth().catch(() => null);
    const { slug, kind } = await req.json();
    if (!slug || !kind) return NextResponse.json({ ok: false }, { status: 400 });
    // Best-effort insert; ignore if DB not migrated yet
    await prisma.kbEvent.create({
      data: {
        slug: String(slug).slice(0, 200),
        kind: String(kind).slice(0, 32),
        userId: session?.user?.id || null,
        orgId: (session as any)?.orgId || null,
      },
    }).catch(() => null);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
