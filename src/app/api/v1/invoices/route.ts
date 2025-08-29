import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orgFromApiKey } from "@/lib/apiAuth";
import { notifyWebhook } from "@/lib/webhooks";
import { invoiceNumber } from "@/lib/numbering";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  const apiKey = auth?.replace("Bearer ", "") || null;
  const org = await orgFromApiKey(apiKey);
  if (!org) return new NextResponse("Unauthorized", { status: 401 });
  const body = await req.json();
  const { customerId, items } = body;
  const number = await invoiceNumber();
  const lines: any[] = [];
  for (const item of items || []) {
    lines.push({
      description: item.description,
      quantity: item.quantity,
      unitPrice: new Prisma.Decimal(item.unitPrice),
      taxCodeId: item.taxCodeId
    });
  }
  const invoice = await prisma.invoice.create({
    data: {
      orgId: org.id,
      customerId,
      number,
      lines: { create: lines }
    },
    include: { lines: true, customer: true }
  });
  await notifyWebhook(org.id, "invoice.created", invoice);
  return NextResponse.json(invoice);
}
