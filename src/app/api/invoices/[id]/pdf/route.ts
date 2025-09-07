import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { invoicePdf } from "@/lib/invoicePdf";
import fs from "fs";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const userOrg = await prisma.userOrg.findFirst({
    where: { userId },
    select: { orgId: true }
  });
  if (!userOrg) {
    return new NextResponse("No organization", { status: 400 });
  }

  const { id } = await params;
  const invoice = await prisma.invoice.findFirst({
    where: { id, orgId: userOrg.orgId },
    include: { customer: true, lines: { include: { taxCode: true } } }
  });
  if (!invoice) {
    return new NextResponse("Not found", { status: 404 });
  }

  let logo: Buffer | undefined;
  try {
    logo = fs.readFileSync(path.join(process.cwd(), "public", "logo.svg"));
  } catch {}
  const pdf = await invoicePdf(
    {
      number: invoice.number,
      issueDate: invoice.issueDate ?? undefined,
      customer: invoice.customer
        ? { name: invoice.customer.name, email: invoice.customer.email || undefined }
        : null,
      lines: invoice.lines.map((l) => ({
        description: l.description || "",
        quantity: l.quantity,
        unitPrice: Number(l.unitPrice),
        taxCode: l.taxCode ? { rate: l.taxCode.rate } : undefined
      }))
    },
    logo
  );
  return new NextResponse(pdf as any, {
    headers: { "Content-Type": "application/pdf" }
  });
}
