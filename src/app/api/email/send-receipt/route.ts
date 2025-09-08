import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { receiptPdf } from "@/lib/receiptPdf";
import { receiptTemplate } from "@/emails/templates";
import { sendMail } from "@/lib/mailer";
import { isDemoSession } from "@/lib/demo";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
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
  const { paymentId, sendToSelf } = await req.json();
  if (!paymentId) {
    return new NextResponse("Missing paymentId", { status: 400 });
  }
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, orgId: userOrg.orgId },
    include: { invoice: { include: { customer: true } } }
  });
  if (!payment || !payment.invoice?.customer?.email) {
    return new NextResponse("Not found", { status: 404 });
  }
  let logo: Buffer | undefined;
  try {
    logo = fs.readFileSync(path.join(process.cwd(), "public", "logos", "logo.svg"));
  } catch {}
  const pdf = await receiptPdf(
    {
      receiptNumber: payment.receiptNumber,
      date: payment.date,
      invoice: payment.invoice ? { number: payment.invoice.number } : undefined,
      amount: Number(payment.amount),
      method: payment.method
    },
    logo
  );
  const { default: mjml2html } = (eval("require")("mjml") as typeof import("mjml"));
  const html = mjml2html(
    receiptTemplate({
      receiptNumber: payment.receiptNumber,
      date: payment.date,
      amount: Number(payment.amount)
    })
  ).html;

  if (await isDemoSession(session)) {
    const allowSendToSelf = Boolean(sendToSelf);
    if (!allowSendToSelf) {
      return NextResponse.json({ ok: true, mode: "preview", html });
    }
    await sendMail({
      to: session.user.email!,
      subject: `Receipt #${payment.receiptNumber}`,
      html,
      attachments: [
        { filename: `receipt-${payment.receiptNumber}.pdf`, content: pdf }
      ]
    });
    return NextResponse.json({ ok: true });
  }

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
