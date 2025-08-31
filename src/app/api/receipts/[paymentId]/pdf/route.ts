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
  const payment = await prisma.payment.findFirst({
    where: { id: params.paymentId, invoice: { orgId: userOrg.orgId } },
    include: { invoice: true }
  });
  if (!payment) {
    return new NextResponse("Not found", { status: 404 });
  }
  let logo: Buffer | undefined;
  try {
    logo = fs.readFileSync(path.join(process.cwd(), "public", "logo.svg"));
  } catch {}
  const pdf = await receiptPdf(payment, logo);
  return new NextResponse(pdf, {
    headers: { "Content-Type": "application/pdf" }
  });
}
