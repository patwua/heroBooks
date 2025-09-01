import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_VAT_CODES } from "@/lib/defaultVatCodes";

// Upsert default tax codes for all organizations
export async function POST() {
  const orgs = await prisma.org.findMany({ select: { id: true } });
  for (const { id: orgId } of orgs) {
    for (const code of DEFAULT_VAT_CODES) {
      await prisma.taxCode.upsert({
        where: { id: `${orgId}-${code.code}` },
        update: { name: code.name, rate: code.rate },
        create: {
          id: `${orgId}-${code.code}`,
          orgId,
          name: code.name,
          rate: code.rate
        }
      });
    }
  }
  return NextResponse.json({ ok: true });
}
