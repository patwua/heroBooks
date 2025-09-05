import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { purgeExpiredDemoDataIfAny, getDemoOrgId } from "@/lib/demo";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }
  await purgeExpiredDemoDataIfAny();
  const orgId = await getDemoOrgId();
  // @ts-ignore next-auth v5 session update
  await session.update({ demo: true, orgId });
  return NextResponse.json({ ok: true, orgId });
}

