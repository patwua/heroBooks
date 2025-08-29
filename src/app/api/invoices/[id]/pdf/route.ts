import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { invoicePdf } from "@/lib/invoicePdf";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { customer: true, items: true }
  });
  if (!invoice) {
    return new NextResponse("Not found", { status: 404 });
  }

  const pdf = await invoicePdf(invoice);
  return new NextResponse(pdf, {
    headers: { "Content-Type": "application/pdf" }
  });
}
