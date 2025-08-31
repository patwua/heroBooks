import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { invoicePdf } from "@/lib/invoicePdf";
import { invoiceTemplate } from "@/emails/templates";
import { sendMail } from "@/lib/mailer";
import fs from "fs";
import path from "path";

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
  const form = await req.formData();
  const invoiceId = form.get("invoiceId")?.toString();
  if (!invoiceId) {
    return new NextResponse("Missing invoiceId", { status: 400 });
  }
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, orgId: userOrg.orgId },
    include: { customer: true, lines: { include: { taxCode: true } } }
  });
  if (!invoice || !invoice.customer?.email) {
    return new NextResponse("Not found", { status: 404 });
  }
  let logo: Buffer | undefined;
  try {
    logo = fs.readFileSync(path.join(process.cwd(), "public", "logo.svg"));
  } catch {}
  const pdf = await invoicePdf(invoice, logo);
  const total = invoice.lines.reduce((sum, l) => {
    const line = l.quantity * Number(l.unitPrice);
    const vat = line * (l.taxCode?.rate || 0);
    return sum + line + vat;
  }, 0);
  const html = invoiceTemplate({
    number: invoice.number,
    issueDate: invoice.issueDate,
    total
  });
  await sendMail({
    to: invoice.customer.email,
    subject: `Invoice #${invoice.number}`,
    html,
    attachments: [
      { filename: `invoice-${invoice.number}.pdf`, content: pdf }
    ]
  });
  return NextResponse.json({ ok: true });
}
