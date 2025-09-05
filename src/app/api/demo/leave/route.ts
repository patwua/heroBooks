import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { purgeExpiredDemoDataIfAny } from "@/lib/demo";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }
  // Opportunistic expired purge
  await purgeExpiredDemoDataIfAny();

  // Unset demo and fall back to the user's last real org (kept in your own session.orgId handling)
  // @ts-ignore
  await session.update({ demo: false, orgId: null });
  return NextResponse.json({ ok: true });
}

