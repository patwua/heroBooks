import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orgFromApiKey } from "@/lib/apiAuth";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const apiKey = auth?.replace("Bearer ", "") || null;
  const org = await orgFromApiKey(apiKey);
  if (!org) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const codes = await prisma.taxCode.findMany({ where: { orgId: org.id } });
  return NextResponse.json(codes);
}
