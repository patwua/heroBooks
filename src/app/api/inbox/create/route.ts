import { NextRequest, NextResponse } from "next/server";

// Minimal JSON inbox endpoint — NO uploads. Replace internals later to route to DB/email/queue.
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();
    const message = String(data.message || data.subjectLine || data.bio || data.goals || "").trim();

    if (!name) return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
    if (!email) return NextResponse.json({ ok: false, error: "Email is required." }, { status: 400 });
    if (!message) return NextResponse.json({ ok: false, error: "Message is required." }, { status: 400 });

    // TODO: wire to your actual persistence/notifications
    // For now just echo back
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}

