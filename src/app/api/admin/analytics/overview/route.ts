import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isSuperUser } from "@/lib/features";

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  const session = await auth();
  const superOk = await isSuperUser();
  if (!session?.user?.id || !superOk) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const today = new Date();
  const from30 = new Date();
  from30.setDate(today.getDate() - 29);

  // Signups last 30 days
  const users = await prisma.user.findMany({
    where: { createdAt: { gte: from30 } as any },
    select: { createdAt: true },
  });
  const signupBuckets = new Map<string, number>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(from30);
    d.setDate(from30.getDate() + i);
    signupBuckets.set(ymd(d), 0);
  }
  users.forEach((u) => {
    const key = ymd(new Date(u.createdAt));
    if (signupBuckets.has(key))
      signupBuckets.set(key, (signupBuckets.get(key) || 0) + 1);
  });

  // Locked feature impressions (TelemetryEvent)
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const events = await prisma.telemetryEvent.findMany({
    where: { createdAt: { gte: since } },
    select: { feature: true, reason: true },
  });
  const lockedAgg = new Map<string, { plan: number; toggle: number }>();
  events.forEach((e) => {
    const f = (e.feature || "unknown").toString();
    const bucket = lockedAgg.get(f) || { plan: 0, toggle: 0 };
    if (e.reason === "plan") bucket.plan += 1;
    else if (e.reason === "toggle") bucket.toggle += 1;
    lockedAgg.set(f, bucket);
  });

  // Top locked pages
  const topPathsRaw = await prisma.telemetryEvent.groupBy({
    by: ["path"],
    where: { createdAt: { gte: since } },
    _count: { path: true },
    orderBy: { _count: { path: "desc" } },
    take: 10,
  });

  return NextResponse.json({
    ok: true,
    data: {
      signups: Array.from(signupBuckets.entries()).map(([day, count]) => ({
        day,
        count,
      })),
      locked: Array.from(lockedAgg.entries()).map(([feature, v]) => ({
        feature,
        plan: v.plan,
        toggle: v.toggle,
      })),
      topPaths: topPathsRaw.map((r) => ({
        path: r.path || "(none)",
        count: r._count.path,
      })),
    },
  });
}
