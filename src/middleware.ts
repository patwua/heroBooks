import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// Read-only check for Auth.js v5 session cookies (Edge-safe).
// v5 defaults: "authjs.session-token" or "__Secure-authjs.session-token"
// Ref: cookie name change from next-auth v4 → v5. 
export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtected =
    /^\/(admin|dashboard|customers|invoices|bills|items|vendors|payments|banking|payroll|reports|settings)(\/|$)/.test(
      path
    )
  if (!isProtected) return NextResponse.next()

  const hasSession =
    !!req.cookies.get("__Secure-authjs.session-token") || !!req.cookies.get("authjs.session-token")

  if (hasSession) return NextResponse.next()

  const url = new URL("/", req.nextUrl.origin)
  url.searchParams.set("auth", "1")
  const res = NextResponse.redirect(url)
  res.cookies.set("hb_next", `${path}${req.nextUrl.search}`, {
    path: "/",
    maxAge: 600,
    sameSite: "lax",
    httpOnly: false,
  })
  return res
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/customers/:path*",
    "/invoices/:path*",
    "/bills/:path*",
    "/items/:path*",
    "/vendors/:path*",
    "/payments/:path*",
    "/banking/:path*",
    "/payroll/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
}
