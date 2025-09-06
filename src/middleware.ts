import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function randomVariant() {
  return Math.random() < 0.5 ? "A" : "B";
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const { pathname } = req.nextUrl;
  const isMarketingRoute =
    pathname === "/" ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/get-started") ||
    pathname.startsWith("/help") ||
    pathname.startsWith("/legal");

  if (!isMarketingRoute) return res;

  if (!req.cookies.get("hb_variant")) {
    res.cookies.set("hb_variant", randomVariant(), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return res;
}

export const config = {
  matcher: [
    "/",
    "/pricing",
    "/about",
    "/contact",
    "/get-started",
    "/help",
    "/legal/:path*",
  ],
};
