import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const orgId = (session as any).orgId || null;
  if (!orgId) return NextResponse.json({ ok: false, error: "No active org" }, { status: 400 });

  const { advisoryId } = await req.json();
  const adv = await prisma.taxAdvisory.findUnique({ where: { id: advisoryId } });
  if (!adv) return NextResponse.json({ ok: false, error: "Advisory not found" }, { status: 404 });

  if (adv.kind === "PAYE") {
    const eff = new Date((adv.payloadJson as any).effectiveFrom);
    const brackets = (adv.payloadJson as any).bracketsMonthly as Array<{ order: number; upTo: string | null; rate: string }>;
    for (const b of brackets) {
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
  }
  if (adv.kind === "NIS") {
    const eff = new Date((adv.payloadJson as any).effectiveFrom);
    const p = adv.payloadJson as any;
    const exists = await prisma.nisSetting.findFirst({ where: { orgId, effectiveFrom: eff } });
    if (!exists) {
      await prisma.nisSetting.create({
        data: {
          orgId,
          employeeRate: new Decimal(p.employeeRate),
          employerRate: new Decimal(p.employerRate),
          ceilingAmount: p.ceilingAmount ? new Decimal(p.ceilingAmount) : null,
          ceilingPeriod: p.ceilingPeriod,
          effectiveFrom: eff,
        },
      });
    } else {
      await prisma.nisSetting.update({
        where: { id: exists.id },
        data: {
          employeeRate: new Decimal(p.employeeRate),
          employerRate: new Decimal(p.employerRate),
          ceilingAmount: p.ceilingAmount ? new Decimal(p.ceilingAmount) : null,
          ceilingPeriod: p.ceilingPeriod,
        },
      });
    }
  }

  await prisma.taxAdvisoryReceipt.upsert({
    where: { orgId_advisoryId: { orgId, advisoryId } },
    create: { orgId, advisoryId, acceptedAt: new Date(), acceptedBy: session.user.id },
    update: { acceptedAt: new Date(), acceptedBy: session.user.id },
  });

  return NextResponse.json({ ok: true });
}

