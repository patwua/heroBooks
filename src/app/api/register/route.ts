import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Email exists" }, { status: 409 });
  const passwordHash = await hash(password, 10);
  await prisma.user.create({ data: { name, email, password: passwordHash } });
  return NextResponse.json({ ok: true }, { status: 201 });
}
