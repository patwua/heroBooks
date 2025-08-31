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

  const customer = await prisma.customer.findFirst({
    where: { id: customerId, orgId: userOrg.orgId },
    select: { id: true }
  });
  if (!customer) {
    return new NextResponse("Invalid customer", { status: 400 });
  }

  const org = await prisma.org.findUnique({
    where: { id: userOrg.orgId },
    include: { settings: true }
  });
  const allowNegativeStock = org?.settings?.allowNegativeStock ?? false;

  const number = await invoiceNumber();

  const invoice = await prisma.$transaction(async (tx) => {
    const lines: any[] = [];
    for (const item of items) {
      if (item.itemId) {
        const dbItem = await tx.item.findFirst({
          where: { id: item.itemId, orgId: userOrg.orgId }
        });
        if (dbItem) {
          if (!allowNegativeStock && dbItem.qtyOnHand < item.quantity) {
            throw new Error("INSUFFICIENT_STOCK");
          }
          await tx.item.update({
            where: { id: dbItem.id },
            data: { qtyOnHand: dbItem.qtyOnHand - item.quantity }
          });
          let taxCodeId = item.taxCodeId ?? dbItem.taxCodeId ?? undefined;
          if (taxCodeId) {
            const tc = await tx.taxCode.findFirst({
              where: { id: taxCodeId, orgId: userOrg.orgId },
              select: { id: true }
            });
            taxCodeId = tc?.id;
          }
          lines.push({
            itemId: dbItem.id,
            description: item.description ?? dbItem.description,
            quantity: item.quantity,
            unitPrice: new Prisma.Decimal(item.unitPrice ?? dbItem.price),
            taxCodeId: taxCodeId ?? undefined
          });
          continue;
        }
      }
      let manualTaxCodeId = item.taxCodeId;
      if (manualTaxCodeId) {
        const tc = await tx.taxCode.findFirst({
          where: { id: manualTaxCodeId, orgId: userOrg.orgId },
          select: { id: true }
        });
        manualTaxCodeId = tc?.id;
      }
      lines.push({
        description: item.description ?? "",
        quantity: item.quantity,
        unitPrice: new Prisma.Decimal(item.unitPrice ?? 0),
        taxCodeId: manualTaxCodeId ?? undefined
      });
    }
    return tx.invoice.create({
      data: {
        orgId: userOrg.orgId,
        customerId: customer.id,
        number,
        lines: { create: lines }
      },
      include: { lines: true, customer: true }
    });
  });
  await notifyWebhook(userOrg.orgId, "invoice.created", invoice);
  return NextResponse.json(invoice);
}
