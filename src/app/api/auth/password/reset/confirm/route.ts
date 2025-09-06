import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { redeemPasswordReset } from "@/lib/mail/password-reset";

export async function POST(req: Request) {
  const { token, password } = await req.json().catch(() => ({}));
  if (!token || !password)
    return NextResponse.json({ error: "invalid-payload" }, { status: 400 });

  const hash = await bcrypt.hash(String(password), 10);
  try {
    await redeemPasswordReset(String(token), hash);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "reset-failed" }, { status: 400 });
  }
}
