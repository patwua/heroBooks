import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { receiptPdf } from "@/lib/receiptPdf";
import fs from "fs";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: { paymentId: string } }
) {
  const session = await getServerSession(authOptions);
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
  const payment = await prisma.payment.findFirst({
    where: { id: params.paymentId, orgId: userOrg.orgId },
    include: { invoice: true }
  });
  if (!payment) {
    return new NextResponse("Not found", { status: 404 });
  }
  let logo: Buffer | undefined;
  try {
    logo = fs.readFileSync(path.join(process.cwd(), "public", "logo.svg"));
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
