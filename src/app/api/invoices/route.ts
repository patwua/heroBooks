import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { invoiceNumber } from "@/lib/numbering";
import { notifyWebhook } from "@/lib/webhooks";
import { Prisma } from "@prisma/client";
import {
  isDemoSession,
  demoReadWhere,
  withDemoWrite,
  resolveActiveOrgId,
  purgeExpiredDemoDataIfAny,
  getDemoOrgId,
} from "@/lib/demo";
import { Decimal } from "@prisma/client/runtime/library";
import { calcLineVat } from "@/lib/tax/vat";

interface InvoiceItemInput {
  itemId?: string;
  description?: string;
  quantity: number;
  unitPrice?: number;
  taxCodeId?: string;
}

async function computeInvoiceTotals(invoiceId: string, orgId: string) {
  const lines = await prisma.invoiceLine.findMany({
    where: { orgId, invoiceId },
    include: { taxCode: true },
  });
  const sub = lines.reduce((acc, l) => acc.add(l.unitPrice.mul(l.quantity)), new Decimal(0));
  const vat = lines.reduce(
    (acc, l) => acc.add(calcLineVat(l.unitPrice, l.quantity, l.taxCode?.rate ?? 0)),
    new Decimal(0),
  );
  const total = sub.add(vat);
  return { subTotal: sub, vatTotal: vat, total };
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });
  if (await isDemoSession(session)) {
    await purgeExpiredDemoDataIfAny();
    const where = await demoReadWhere(session);
    const invoices = await prisma.invoice.findMany({ where, include: { customer: true } });
    return NextResponse.json(invoices);
  }
  const orgId = await resolveActiveOrgId(session);
  if (!orgId) return new NextResponse("No organization", { status: 400 });
  const invoices = await prisma.invoice.findMany({ where: { orgId }, include: { customer: true } });
  return NextResponse.json(invoices);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });
  const demo = await isDemoSession(session);
  const orgId = demo ? await getDemoOrgId() : await resolveActiveOrgId(session);
  if (!orgId) return new NextResponse("No organization", { status: 400 });
  const body = await req.json();
  const { customerId, items }: { customerId: string; items: InvoiceItemInput[] } = body;

  const org = await prisma.org.findUnique({
    where: { id: orgId },
    include: { settings: true },
  });
  const allowNegativeStock = org?.settings?.allowNegativeStock ?? false;

  const number = await invoiceNumber();

  try {
    const invoice = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findFirst({
        where: { id: customerId, orgId },
        select: { id: true },
      });
      if (!customer) {
        throw new Error("CUSTOMER_NOT_FOUND");
      }
      const lines: any[] = [];
      for (const item of items) {
        if (item.itemId) {
          const dbItem = await tx.item.findFirst({
            where: { id: item.itemId, orgId },
          });
          if (!dbItem) {
            throw new Error("ITEM_NOT_FOUND");
          }
          if (!demo) {
            if (!allowNegativeStock && dbItem.qtyOnHand < item.quantity) {
              throw new Error("INSUFFICIENT_STOCK");
            }
            await tx.item.update({
              where: { id: dbItem.id },
              data: { qtyOnHand: dbItem.qtyOnHand - item.quantity },
            });
          }
          let taxCodeId = item.taxCodeId ?? dbItem.taxCodeId ?? undefined;
          if (taxCodeId) {
            const tc = await tx.taxCode.findFirst({
              where: { id: taxCodeId, orgId },
              select: { id: true },
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
            taxCodeId,
          });
          continue;
        }
        let manualTaxCodeId = item.taxCodeId;
        if (manualTaxCodeId) {
          const tc = await tx.taxCode.findFirst({
            where: { id: manualTaxCodeId, orgId },
            select: { id: true },
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
          taxCodeId: manualTaxCodeId,
        });
      }
      const data = demo
        ? await withDemoWrite(session, {
            customerId: customer.id,
            number,
            lines: { create: lines },
          })
        : {
            orgId,
            customerId: customer.id,
            number,
            lines: { create: lines },
          };
      return tx.invoice.create({ data, include: { lines: true, customer: true } });
    });
    if (!demo) await notifyWebhook(orgId, "invoice.created", invoice);
    const totals = await computeInvoiceTotals(invoice.id, orgId);
    return NextResponse.json({ ok: true, data: { invoice: demo ? { ...invoice, demo: true } : invoice, totals } });
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

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });
  const orgId = await resolveActiveOrgId(session);
  if (!orgId) return new NextResponse("No organization", { status: 400 });

  const body = await req.json();
  const { id, customerId, issueDate, dueDate, status, items } = body as any;
  if (!id) return new NextResponse("Missing invoice id", { status: 400 });

  await prisma.invoice.update({
    where: { id },
    data: {
      customerId: customerId ?? undefined,
      issueDate: issueDate ? new Date(issueDate) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      status: status ?? undefined,
    },
  });

  if (Array.isArray(items)) {
    await prisma.invoiceLine.deleteMany({ where: { orgId, invoiceId: id } });

    const itemIds = items.map((l: any) => l.itemId).filter(Boolean);
    const dbItems = itemIds.length
      ? await prisma.item.findMany({ where: { orgId, id: { in: itemIds } } })
      : [];
    const itemById = new Map(dbItems.map((i) => [i.id, i]));

    await prisma.invoice.update({
      where: { id },
      data: {
        lines: {
          create: items.map((l: any) => {
            const it = l.itemId ? itemById.get(l.itemId) : null;
            return {
              orgId,
              itemId: l.itemId ?? null,
              description: l.description ?? it?.description ?? null,
              quantity: l.quantity ?? 1,
              unitPrice: l.unitPrice ? new Prisma.Decimal(l.unitPrice) : new Prisma.Decimal(it?.price ?? 0),
              taxCodeId: l.taxCodeId ?? it?.taxCodeId ?? null,
            };
          }),
        },
      },
    });
  }

  const totals = await computeInvoiceTotals(id, orgId);
  return NextResponse.json({ ok: true, data: { id, totals } });
}

