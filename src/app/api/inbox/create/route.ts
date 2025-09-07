import { NextResponse } from "next/server";
import { z } from "zod";

const InboxSchema = z
  .object({
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Valid email is required."),
    message: z.string().min(1, "Message is required."),
  })
  .passthrough();

// Minimal JSON inbox endpoint — NO uploads. Replace internals later to route to DB/email/queue.
export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = InboxSchema.safeParse(json);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { ok: false, error: issue?.message || "Invalid input" },
        { status: 400 }
      );
    }

    // TODO: wire to your actual persistence/notifications
    // For now just echo back success
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}

