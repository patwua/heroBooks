import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, value, maxAge } = await req.json();
  if (!name || typeof value !== "string") {
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(name, value, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: typeof maxAge === "number" ? maxAge : 60 * 60 * 24 * 365,
  });
  return res;
}
