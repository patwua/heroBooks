import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { invoiceNumber } from "@/lib/numbering";
import { notifyWebhook } from "@/lib/webhooks";
import { Prisma } from "@prisma/client";

interface InvoiceItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
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
  const number = await invoiceNumber();
  const lines = items.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    unitPrice: new Prisma.Decimal(item.unitPrice),
    taxCodeId: item.taxCodeId
  }));
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
