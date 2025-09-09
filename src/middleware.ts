import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

// Verify Auth.js v5 session token via JWT (Edge-safe)
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtected =
    /^\/(admin|dashboard|customers|invoices|bills|items|vendors|payments|banking|payroll|reports|settings)(\/|$)/.test(
      path
    )
  if (!isProtected) return NextResponse.next()

  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
  const token = await getToken({ req, secret })

  if (token) return NextResponse.next()

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
