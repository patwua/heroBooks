import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const orgId = (session as any).orgId || null;
  if (!orgId) return NextResponse.json({ ok: false, error: "No active org" }, { status: 400 });

  const body = (await req.json()) as {
    effectiveFrom: string;
    brackets: { order: number; upTo: string | null; rate: string }[];
  };
  const eff = new Date(body.effectiveFrom);

  for (const b of body.brackets) {
    const found = await prisma.payeBracket.findFirst({ where: { orgId, effectiveFrom: eff, order: b.order } });
    if (!found) {
      await prisma.payeBracket.create({
        data: { orgId, order: b.order, upTo: b.upTo ? new Decimal(b.upTo) : null, rate: new Decimal(b.rate), effectiveFrom: eff },
      });
    } else {
      await prisma.payeBracket.update({
        where: { id: found.id },
        data: { upTo: b.upTo ? new Decimal(b.upTo) : null, rate: new Decimal(b.rate) },
      });
    }
  }

  return NextResponse.json({ ok: true });
}

