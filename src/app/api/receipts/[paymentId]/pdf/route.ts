import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { receiptPdf } from "@/lib/receiptPdf";
import fs from "fs";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ paymentId: string }> }
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
  const { paymentId } = await params;
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, orgId: userOrg.orgId },
    include: { invoice: true }
  });
  if (!payment) {
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
  return new NextResponse(pdf as any, {
    headers: { "Content-Type": "application/pdf" }
  });
}
