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
    employeeRate: string;
    employerRate: string;
    ceilingAmount?: string | null;
    ceilingPeriod: string;
  };
  const eff = new Date(body.effectiveFrom);

  const existing = await prisma.nisSetting.findFirst({ where: { orgId, effectiveFrom: eff } });
  if (!existing) {
    await prisma.nisSetting.create({
      data: {
        orgId,
        employeeRate: new Decimal(body.employeeRate),
        employerRate: new Decimal(body.employerRate),
        ceilingAmount: body.ceilingAmount ? new Decimal(body.ceilingAmount) : null,
        ceilingPeriod: body.ceilingPeriod,
        effectiveFrom: eff,
      },
    });
  } else {
    await prisma.nisSetting.update({
      where: { id: existing.id },
      data: {
        employeeRate: new Decimal(body.employeeRate),
        employerRate: new Decimal(body.employerRate),
        ceilingAmount: body.ceilingAmount ? new Decimal(body.ceilingAmount) : null,
        ceilingPeriod: body.ceilingPeriod,
      },
    });
  }

  return NextResponse.json({ ok: true });
}

