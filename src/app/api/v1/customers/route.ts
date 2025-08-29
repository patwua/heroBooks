import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orgFromApiKey } from "@/lib/apiAuth";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  const apiKey = auth?.replace("Bearer ", "") || null;
  const org = await orgFromApiKey(apiKey);
  if (!org) return new NextResponse("Unauthorized", { status: 401 });
  const { name, email } = await req.json();
  const customer = await prisma.customer.create({
    data: { orgId: org.id, name, email }
  });
  return NextResponse.json(customer);
}
