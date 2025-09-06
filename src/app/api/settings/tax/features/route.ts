import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const orgId = (session as any).orgId || null;
  if (!orgId) return NextResponse.json({ ok: false, error: "No active org" }, { status: 400 });

  const { enableVAT, enablePAYE, enableNIS, enablePropTax, effectiveFrom } = body as Partial<{
    enableVAT: boolean; enablePAYE: boolean; enableNIS: boolean; enablePropTax: boolean; effectiveFrom?: string;
  }>;

  const payload: any = {
    enableVAT: enableVAT ?? undefined,
    enablePAYE: enablePAYE ?? undefined,
    enableNIS: enableNIS ?? undefined,
    enablePropTax: enablePropTax ?? undefined,
  };
  if (effectiveFrom) payload.effectiveFrom = new Date(effectiveFrom);

  const row = await prisma.orgTaxFeature.upsert({
    where: { orgId },
    create: { orgId, enableVAT: true, enablePAYE: false, enableNIS: false, enablePropTax: false, ...(payload.effectiveFrom ? { effectiveFrom: payload.effectiveFrom } : {}) },
    update: payload,
  });

  return NextResponse.json({ ok: true, data: row });
}

