import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { receiptPdf } from "@/lib/receiptPdf";
import { receiptTemplate } from "@/emails/templates";
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
  const { paymentId } = await req.json();
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, invoice: { orgId: userOrg.orgId } },
    include: { invoice: { include: { customer: true } } }
  });
  if (!payment || !payment.invoice?.customer?.email) {
    return new NextResponse("Not found", { status: 404 });
  }
  let logo: Buffer | undefined;
  try {
    logo = fs.readFileSync(path.join(process.cwd(), "public", "logo.svg"));
  } catch {}
  const pdf = await receiptPdf(payment, logo);
  const html = receiptTemplate({
    receiptNumber: payment.receiptNumber,
    date: payment.date,
    amount: Number(payment.amount)
  });
  await sendMail({
    to: payment.invoice.customer.email,
    subject: `Receipt #${payment.receiptNumber}`,
    html,
    attachments: [
      { filename: `receipt-${payment.receiptNumber}.pdf`, content: pdf }
    ]
  });
  return NextResponse.json({ ok: true });
}
