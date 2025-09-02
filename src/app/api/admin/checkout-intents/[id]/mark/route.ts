import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.reason }, { status: 403 });

  const id = params.id;
  const { status, note } = await req.json();
  if (!["paid", "failed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "invalid-status" }, { status: 400 });
  }

  await prisma.checkoutIntent.update({
    where: { id },
    data: { status },
  });

  if (note) {
    // Optionally write an audit note if you have an AuditLog; for now we just noop.
    // You can add an AuditLog model later and insert here.
  }

  return NextResponse.json({ ok: true });
}
