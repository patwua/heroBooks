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
  const { customerId, items = [] } = body;

  const orgRecord = await prisma.org.findUnique({
    where: { id: org.id },
    include: { settings: true }
  });
  const allowNegativeStock = orgRecord?.settings?.allowNegativeStock ?? false;

  const number = await invoiceNumber();

  try {
    const invoice = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findFirst({
        where: { id: customerId, orgId: org.id },
        select: { id: true }
      });
      if (!customer) {
        throw new Error("CUSTOMER_NOT_FOUND");
      }
      const lines: any[] = [];
      for (const item of items) {
        if (item.itemId) {
          const dbItem = await tx.item.findFirst({
            where: { id: item.itemId, orgId: org.id }
          });
          if (!dbItem) {
            throw new Error("ITEM_NOT_FOUND");
          }
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
              where: { id: taxCodeId, orgId: org.id },
              select: { id: true }
            });
            if (!tc) {
              throw new Error("TAXCODE_NOT_FOUND");
            }
            taxCodeId = tc.id;
          }
          lines.push({
            itemId: dbItem.id,
            description: item.description ?? dbItem.description,
            quantity: item.quantity,
            unitPrice: new Prisma.Decimal(item.unitPrice ?? dbItem.price),
            taxCodeId: taxCodeId
          });
          continue;
        }
        let manualTaxCodeId = item.taxCodeId;
        if (manualTaxCodeId) {
          const tc = await tx.taxCode.findFirst({
            where: { id: manualTaxCodeId, orgId: org.id },
            select: { id: true }
          });
          if (!tc) {
            throw new Error("TAXCODE_NOT_FOUND");
          }
          manualTaxCodeId = tc.id;
        }
        lines.push({
          description: item.description ?? "",
          quantity: item.quantity,
          unitPrice: new Prisma.Decimal(item.unitPrice ?? 0),
          taxCodeId: manualTaxCodeId
        });
      }
      return tx.invoice.create({
        data: {
          orgId: org.id,
          customerId: customer.id,
          number,
          lines: { create: lines }
        },
        include: { lines: true, customer: true }
      });
    });
    await notifyWebhook(org.id, "invoice.created", invoice);
    return NextResponse.json(invoice);
  } catch (err: any) {
    if (
      err.message === "ITEM_NOT_FOUND" ||
      err.message === "TAXCODE_NOT_FOUND" ||
      err.message === "CUSTOMER_NOT_FOUND"
    ) {
      return new NextResponse("Not found", { status: 404 });
    }
    if (err.message === "INSUFFICIENT_STOCK") {
      return new NextResponse("Insufficient stock", { status: 400 });
    }
    throw err;
  }
}
