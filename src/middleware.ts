import { auth } from "@/auth"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// Protect app routes; when unauthenticated:
// 1) stash target in hb_next (10 min),
// 2) send to "/" with ?auth=1 to auto-open the dropdown.
export default auth((req: NextRequest) => {
  const { nextUrl } = req
  const path = nextUrl.pathname
  const isProtected =
    /^\/(admin|dashboard|customers|invoices|bills|items|vendors|payments|banking|payroll|reports|settings)(\/|$)/.test(
      path
    )
  if (!req.auth && isProtected) {
    const url = new URL("/", nextUrl.origin)
    url.searchParams.set("auth", "1")
    const res = NextResponse.redirect(url)
    res.headers.append(
      "Set-Cookie",
      `hb_next=${encodeURIComponent(path + nextUrl.search)}; Path=/; Max-Age=600; SameSite=Lax`
    )
    return res
  }
  return NextResponse.next()
})

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
