import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

interface InvoiceItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
  vatCodeId?: string;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const invoices = await prisma.invoice.findMany({
    where: { organization: { ownerId: session.user.id } },
    include: { customer: true }
  });

  return NextResponse.json(invoices);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { customerId, items }: { customerId: string; items: InvoiceItemInput[] } = body;

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { organizationId: true }
  });
  if (!customer) {
    return new NextResponse("Invalid customer", { status: 400 });
  }

  const itemsData = [] as any[];
  let total = 0;
  for (const item of items) {
    let vatRate = 0;
    if (item.vatCodeId) {
      const code = await prisma.vatCode.findUnique({ where: { id: item.vatCodeId } });
      if (code) vatRate = code.rate;
    }
    const line = item.quantity * item.unitPrice;
    const lineTotal = line + line * vatRate;
    total += lineTotal;
    itemsData.push({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      vatCodeId: item.vatCodeId,
      lineTotal
    });
  }

  const invoice = await prisma.invoice.create({
    data: {
      organizationId: customer.organizationId,
      customerId,
      total,
      items: {
        create: itemsData
      }
    },
    include: { items: true }
  });

  return NextResponse.json(invoice);
}
