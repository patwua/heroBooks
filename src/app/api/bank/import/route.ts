import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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
  const file = form.get("file") as File | null;
  const bankName = (form.get("bankName") as string) || "Bank";
  const accountNo = (form.get("accountNo") as string) || "";

  if (!file) {
    return new NextResponse("No file", { status: 400 });
  }

  const text = await file.text();
  const lines = text.trim().split(/\r?\n/).slice(1); // skip header
  const data = lines
    .map((line) => {
      const [dateStr, amountStr, memo] = line.split(",");
      if (!dateStr || !amountStr) return null;
      const amount = parseFloat(amountStr);
      if (isNaN(amount)) return null;
      return {
        orgId: userOrg.orgId,
        bankName,
        accountNo,
        date: new Date(dateStr),
        amount: new Prisma.Decimal(amount),
        type: amount >= 0 ? "CREDIT" : "DEBIT",
        memo
      };
    })
    .filter(Boolean) as any[];

  if (data.length === 0) {
    return NextResponse.json({ inserted: 0 });
  }

  await prisma.bankTransaction.createMany({ data });
  return NextResponse.json({ inserted: data.length });
}
