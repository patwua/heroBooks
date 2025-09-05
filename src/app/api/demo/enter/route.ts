import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { assertDemoConfigured, purgeExpiredDemoDataIfAny, DEMO_ORG_ID } from "@/lib/demo";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }
  assertDemoConfigured();

  await purgeExpiredDemoDataIfAny();
  // @ts-ignore next-auth v5 session update
  await session.update({ demo: true, orgId: DEMO_ORG_ID });
  return NextResponse.json({ ok: true });
}

