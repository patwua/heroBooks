import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { leaveDemo } from "@/lib/demo";

export async function GET() {
  return NextResponse.json(
    { error: "Use POST /api/demo/leave while authenticated." },
    { status: 405 }
  );
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  await leaveDemo();
  return NextResponse.json({ ok: true, redirect: "/dashboard" });
}

