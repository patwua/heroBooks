import { NextResponse } from "next/server";
import { issuePasswordReset } from "@/lib/mail/password-reset";

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}));
  if (!email) return NextResponse.json({ error: "email-required" }, { status: 400 });

  await issuePasswordReset(String(email));
  return NextResponse.json({ ok: true });
}
