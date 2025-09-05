import type { Session } from "next-auth";
import { prisma } from "@/lib/prisma";

export const DEMO_ORG_ID = process.env.DEMO_ORG_ID;
const DEMO_TTL_HOURS = Number(process.env.DEMO_TTL_HOURS || "72");

/** Is current session in demo mode? */
export function isDemoSession(session: Session | null | undefined) {
  return Boolean(session?.demo && DEMO_ORG_ID && session?.orgId === DEMO_ORG_ID);
}

/** Resolve active orgId based on session (demo takes precedence) */
export function resolveActiveOrgId(session: Session | null | undefined): string | undefined {
  if (!session?.user?.id) return undefined;
  if (isDemoSession(session)) return DEMO_ORG_ID as string;
  return (session as any).orgId as string | undefined; // set by your org switcher
}

/** Opportunistically purge expired demo rows (if you later add demo columns). */
export async function purgeExpiredDemoDataIfAny() {
  // Placeholder for future ephemeral DB purge — safe no-op today.
  return;
}

/** Ensure demo config is healthy before entering demo. */
export function assertDemoConfigured() {
  if (!DEMO_ORG_ID) {
    throw new Error("DEMO_ORG_ID not configured");
  }
}

/** TTL helper in ms */
export function demoTtlMs() {
  return DEMO_TTL_HOURS * 60 * 60 * 1000;
}

