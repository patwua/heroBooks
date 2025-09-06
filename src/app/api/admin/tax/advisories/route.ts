import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  // TODO: check admin role here

  const body = (await req.json()) as {
    region: string;
    kind: string;
    title: string;
    body: string;
    payloadJson: any;
    effectiveFrom: string;
  };
  const row = await prisma.taxAdvisory.create({ data: { ...body, effectiveFrom: new Date(body.effectiveFrom) } });
  return NextResponse.json({ ok: true, data: row });
}

