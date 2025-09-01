import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  const customers = await prisma.customer.findMany({
    where: { org: { members: { some: { userId } } } }
  });

  return NextResponse.json(customers);
}
