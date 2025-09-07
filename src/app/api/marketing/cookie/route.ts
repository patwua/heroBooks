import { NextResponse } from "next/server";

const ALLOWED_COOKIE_NAMES = ["marketing_consent"];

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    const { host } = new URL(req.url);
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const { name, value, maxAge } = await req.json();
  if (!ALLOWED_COOKIE_NAMES.includes(name) || typeof value !== "string") {
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
