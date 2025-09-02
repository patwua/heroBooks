// List endpoint (optional; page queries DB directly, but this is handy for clients)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.reason }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const status = searchParams.get("status") || undefined;
  const method = searchParams.get("method") || undefined;
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const pageSize = Math.min(100, Math.max(10, Number(searchParams.get("size") || "20")));

  const where: any = {};
  if (status && status !== "all") where.status = status;
  if (method && method !== "all") where.paymentMethod = method;
  if (q) {
    where.OR = [
      { id: { contains: q } },
      { externalRef: { contains: q } },
      { plan: { contains: q } },
      { user: { email: { contains: q } } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.checkoutIntent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { user: { select: { email: true, name: true } } },
    }),
    prisma.checkoutIntent.count({ where }),
  ]);

  return NextResponse.json({ rows, total, page, pageSize });
}
