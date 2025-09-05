import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { ORG_COOKIE_NAME } from "@/lib/tenant";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauth" }, { status: 401 });

  const { orgId } = await req.json();
  if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

  // validate membership
  const membership = await prisma.userOrg.findFirst({
    where: { userId: session.user.id, orgId },
    select: { id: true },
  });
  if (!membership) return NextResponse.json({ error: "not a member" }, { status: 403 });

  // set cookie (httpOnly)
  cookies().set(ORG_COOKIE_NAME, orgId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
  });

  return NextResponse.json({ ok: true });
}
