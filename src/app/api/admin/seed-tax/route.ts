import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_VAT_CODES } from "@/lib/defaultVatCodes";

// Upsert default VAT codes
export async function POST() {
  for (const code of DEFAULT_VAT_CODES) {
    await prisma.vatCode.upsert({
      where: { organizationId_code: { organizationId: null, code: code.code } },
      update: { name: code.name, rate: code.rate },
      create: {
        code: code.code,
        name: code.name,
        rate: code.rate
      }
    });
  }
  return NextResponse.json({ ok: true });
}
