import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const emailLower = String(email).trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: emailLower } });
  if (existing) return NextResponse.json({ error: "Email exists" }, { status: 409 });

  const passwordHash = await bcrypt.hash(String(password), 10);
  await prisma.user.create({
    data: { email: emailLower, passwordHash, name: emailLower.split("@")[0] },
  });

  return NextResponse.json({ ok: true });
}
