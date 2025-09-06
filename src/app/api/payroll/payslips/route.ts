import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";
import { computePAYE } from "@/lib/tax/paye";
import { computeNIS } from "@/lib/tax/nis";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const orgId = (session as any).orgId || null;
  if (!orgId) return NextResponse.json({ ok: false, error: "No active org" }, { status: 400 });

  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const where: any = { orgId };
  if (from || to) where.period = { gte: from ? new Date(from) : undefined, lte: to ? new Date(to) : undefined };

  const rows = await prisma.payslip.findMany({ where, orderBy: { period: "desc" } });
  return NextResponse.json({ ok: true, data: rows });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const orgId = (session as any).orgId || null;
  if (!orgId) return NextResponse.json({ ok: false, error: "No active org" }, { status: 400 });

  const body = await req.json();
  const { employeeName, employeeEmail, period, gross } = body as { employeeName: string; employeeEmail?: string; period: string; gross: string };
  if (!employeeName || !period || !gross) return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });

  const periodDate = new Date(period);
  const grossDec = new Decimal(gross);

  const { allowance, chargeable, tax } = await computePAYE(orgId, periodDate, grossDec);
  const { employee: nisEmp, employer: nisEr, insurable } = await computeNIS(orgId, periodDate, grossDec);
  const net = grossDec.sub(tax).sub(nisEmp);

  const row = await prisma.payslip.create({
    data: {
      orgId,
      period: periodDate,
      employeeName,
      employeeEmail: employeeEmail ?? null,
      gross: grossDec,
      allowance,
      chargeable,
      payeTax: tax,
      nisEmployee: nisEmp,
      nisEmployer: nisEr,
      nisInsurable: insurable,
      net,
    },
  });

  return NextResponse.json({ ok: true, data: row });
}
