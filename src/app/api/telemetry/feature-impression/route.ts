import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id || "anon";
  const email = session?.user?.email || "";

  const body = await req.json().catch(() => ({}));
  const { feature, reason, path } = body as {
    feature?: string;
    reason?: string;
    path?: string;
  };

  // For now, just log; you can later store to a table or send to an analytics sink.
  console.log("telemetry:feature-impression", {
    ts: new Date().toISOString(),
    userId,
    email,
    feature,
    reason,
    path,
  });

  return NextResponse.json({ ok: true });
}

