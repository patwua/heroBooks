import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "./auth";

type AdminGate =
  | { ok: true; user: Session["user"]; reason: null }
  | {
      ok: false;
      reason: "unauthorized" | "no-admin-config" | "forbidden";
    };

export async function requireAdmin(): Promise<AdminGate> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return { ok: false, reason: "unauthorized" };
  const allow = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (!allow.length) return { ok: false, reason: "no-admin-config" };
  const is = allow.includes(session.user.email.toLowerCase());
  if (!is) return { ok: false, reason: "forbidden" };
  return { ok: true, user: session.user, reason: null };
}
