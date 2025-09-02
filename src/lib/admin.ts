import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { ok: false as const, reason: "unauthorized" };
  const allow = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (!allow.length) return { ok: false as const, reason: "no-admin-config" };
  const is = allow.includes(session.user.email.toLowerCase());
  return { ok: is as const, user: session.user, reason: is ? null : "forbidden" as const };
}
