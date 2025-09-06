import type { Session } from "next-auth";
import { prisma } from "@/lib/prisma";

const RAW_DEMO_ORG = process.env.DEMO_ORG_ID || "";
const DEMO_TTL_HOURS = Number(process.env.DEMO_TTL_HOURS || "72");

let cachedDemoOrgId: string | undefined;

/**
 * Resolve the demo org id:
 * - If DEMO_ORG_ID looks like a cuid/uuid and matches an existing org, use it.
 * - Otherwise, treat DEMO_ORG_ID as a name: find or create org with that name and return its id.
 * Caches result for this process.
 */
export async function getDemoOrgId(): Promise<string> {
  if (cachedDemoOrgId) return cachedDemoOrgId;
  const val = RAW_DEMO_ORG.trim();
  if (!val) throw new Error("DEMO_ORG_ID not configured");

  // Try by id first
  const existingById = await prisma.org.findFirst({ where: { id: val }, select: { id: true } });
  if (existingById) {
    cachedDemoOrgId = existingById.id;
    return cachedDemoOrgId;
  }

  // Otherwise treat as name
  let byName = await prisma.org.findFirst({ where: { name: val }, select: { id: true } });
  if (!byName) {
    byName = await prisma.org.create({
      data: { name: val },
      select: { id: true },
    });
  }
  cachedDemoOrgId = byName.id;
  return cachedDemoOrgId!;
}

/** Is current session in demo mode (and demo org configured)? */
export async function isDemoSession(session: Session | null | undefined) {
  if (!session?.demo) return false;
  if (!RAW_DEMO_ORG.trim()) return false;
  const demoOrgId = await getDemoOrgId();
  return Boolean(session?.orgId === demoOrgId);
}

/** Resolve active orgId based on session (demo takes precedence) */
export async function resolveActiveOrgId(session: Session | null | undefined): Promise<string | undefined> {
  if (!session?.user?.id) return undefined;
  if (await isDemoSession(session)) return getDemoOrgId();
  return (session as any).orgId as string | undefined; // set by your org switcher
}

/** TTL helper in ms */
export function demoTtlMs() {
  return DEMO_TTL_HOURS * 60 * 60 * 1000;
}

/** Delete expired demo rows (cheap, index-backed). Safe no-op if models absent. */
export async function purgeExpiredDemoDataIfAny() {
  const now = new Date();
  // Extend this list if you add more demo-enabled tables
  await Promise.allSettled([
    prisma.invoice.deleteMany({ where: { isDemo: true, expiresAt: { lt: now } } as any }),
    prisma.payment.deleteMany({ where: { isDemo: true, expiresAt: { lt: now } } as any }),
    prisma.estimate.deleteMany({ where: { isDemo: true, expiresAt: { lt: now } } as any }),
    prisma.customer.deleteMany({ where: { isDemo: true, expiresAt: { lt: now } } as any }),
    prisma.item.deleteMany({ where: { isDemo: true, expiresAt: { lt: now } } as any }),
    prisma.bankTransaction.deleteMany({ where: { isDemo: true, expiresAt: { lt: now } } as any }),
  ]);
}

/** Patch a write for demo: stamp orgId, isDemo, demoSessionId, expiresAt, createdByUserId. */
export async function withDemoWrite<T extends Record<string, any>>(session: Session, body: T) {
  const orgId = await getDemoOrgId();
  return {
    ...body,
    orgId,
    isDemo: true,
    demoSessionId: session.demoSessionId,
    expiresAt: new Date(Date.now() + demoTtlMs()),
  };
}

/** Demo read filter: only seed(!isDemo) + my ephemeral (isDemo + my session) for this org */
export async function demoReadWhere(session: Session): Promise<Record<string, any>> {
  const orgId = await getDemoOrgId();
  return {
    orgId,
    OR: [
      { isDemo: false }, // seeded
      { isDemo: true, demoSessionId: session.demoSessionId },
    ],
  };
}

/** In demo, block org-level settings change by stripping known fields. */
export function stripOrgSettings<T extends Record<string, any>>(data: T) {
  const copy: Record<string, any> = { ...data };
  delete copy.companyName;
  delete copy.logoUrl;
  delete copy.address;
  delete copy.phone;
  delete copy.taxNumber;
  delete copy.vatSettings;
  delete copy.numbering; // etc — adjust to your model
  return copy as T;
}

