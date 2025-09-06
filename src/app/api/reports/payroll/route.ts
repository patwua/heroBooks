import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { canUseFeature } from "@/lib/features";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const orgId = (session as any).orgId || null;
  if (!orgId)
    return NextResponse.json({ ok: false, error: "No active org" }, { status: 400 });

  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const where: any = { orgId };
  if (from || to)
    where.period = {
      gte: from ? new Date(from) : undefined,
      lte: to ? new Date(to) : undefined,
    };

  const allowed = await canUseFeature("payroll", orgId);
  if (!allowed)
    return NextResponse.json(
      { ok: false, error: "Payroll feature not enabled" },
      { status: 403 },
    );

    const rows = await prisma.payslip.findMany({ where });

  // Group by YYYY-MM
  const buckets = new Map<string, { gross: number; paye: number; nisEmp: number; nisEr: number }>();
  for (const r of rows) {
    const key = `${r.period.getUTCFullYear()}-${String(r.period.getUTCMonth() + 1).padStart(2, "0")}`;
    const b = buckets.get(key) || { gross: 0, paye: 0, nisEmp: 0, nisEr: 0 };
    b.gross += Number(r.gross);
    b.paye += Number(r.payeTax);
    b.nisEmp += Number(r.nisEmployee);
    b.nisEr += Number(r.nisEmployer);
    buckets.set(key, b);
  }

  const data = Array.from(buckets.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([month, v]) => ({ month, ...v }));
  return NextResponse.json({ ok: true, data });
}
