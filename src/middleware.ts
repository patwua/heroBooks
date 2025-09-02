import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Protect (app) area from being statically cached; enforce auth via page logic.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api/auth|sign-in|sign-up|favicon.ico).*)"],
};
