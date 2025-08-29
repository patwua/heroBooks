import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { invoiceNumber } from "@/lib/numbering";
import { notifyWebhook } from "@/lib/webhooks";
import { Prisma } from "@prisma/client";

interface InvoiceItemInput {
  itemId?: string;
  description?: string;
  quantity: number;
  unitPrice?: number;
  taxCodeId?: string;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const userOrg = await prisma.userOrg.findFirst({
    where: { userId: session.user.id },
    select: { orgId: true }
  });
  if (!userOrg) {
    return new NextResponse("No organization", { status: 400 });
  }
  const invoices = await prisma.invoice.findMany({
    where: { orgId: userOrg.orgId },
    include: { customer: true }
  });
  return NextResponse.json(invoices);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const userOrg = await prisma.userOrg.findFirst({
    where: { userId: session.user.id },
    select: { orgId: true }
  });
  if (!userOrg) {
    return new NextResponse("No organization", { status: 400 });
  }
  const body = await req.json();
  const { customerId, items }: { customerId: string; items: InvoiceItemInput[] } = body;

  const org = await prisma.org.findUnique({
    where: { id: userOrg.orgId },
    include: { settings: true }
  });
  const allowNegativeStock = org?.settings?.allowNegativeStock ?? false;

  const number = await invoiceNumber();
  const lines: any[] = [];
  for (const item of items) {
    if (item.itemId) {
      const dbItem = await prisma.item.findUnique({ where: { id: item.itemId } });
      if (dbItem) {
        if (!allowNegativeStock && dbItem.qtyOnHand < item.quantity) {
          throw new Error("INSUFFICIENT_STOCK");
        }
        await prisma.item.update({
          where: { id: dbItem.id },
          data: { qtyOnHand: dbItem.qtyOnHand - item.quantity }
        });
        lines.push({
          itemId: dbItem.id,
          description: item.description ?? dbItem.description,
          quantity: item.quantity,
          unitPrice: new Prisma.Decimal(item.unitPrice ?? dbItem.price),
          taxCodeId: item.taxCodeId ?? dbItem.taxCodeId ?? undefined
        });
        continue;
      }
    }
    lines.push({
      description: item.description ?? "",
      quantity: item.quantity,
      unitPrice: new Prisma.Decimal(item.unitPrice ?? 0),
      taxCodeId: item.taxCodeId
    });
  }
  const invoice = await prisma.invoice.create({
    data: {
      orgId: userOrg.orgId,
      customerId,
      number,
      lines: { create: lines }
    },
    include: { lines: true, customer: true }
  });
  await notifyWebhook(userOrg.orgId, "invoice.created", invoice);
  return NextResponse.json(invoice);
}
