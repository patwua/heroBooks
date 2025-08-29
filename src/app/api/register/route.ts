import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Email exists" }, { status: 409 });
  const passwordHash = await hash(password, 10);
  await prisma.user.create({ data: { name, email, passwordHash } });
  return NextResponse.json({ ok: true }, { status: 201 });
}
