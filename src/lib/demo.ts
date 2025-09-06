import type { Session } from "next-auth";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ORG_COOKIE_NAME } from "@/lib/tenant";

const DEMO_COOKIE = "hb_demo";
const LAST_ENTER_COOKIE = "hb_demo_last";
const RAW_DEMO_ORG = (process.env.DEMO_ORG_ID ?? "").trim();
const DEMO_TTL_HOURS = Number(process.env.DEMO_TTL_HOURS || "72");

let cachedDemoOrgId: string | undefined;

/** Resolve DEMO_ORG_ID env as an existing org (by id or exact name) or create it. Also ensure current user membership. */
export async function getOrCreateDemoOrgId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const raw = RAW_DEMO_ORG;
  if (!raw) throw new Error("DEMO_ORG_ID not set");

  // 1) try by primary key id
  let org = await prisma.org.findUnique({ where: { id: raw } });

  // 2) else try by name
  if (!org) {
    org = await prisma.org.findFirst({ where: { name: raw } });
  }

  // 3) else create
  if (!org) {
    org = await prisma.org.create({
      data: {
        name: raw,
        // seed any defaults you want for demo org here (tax codes, sequences, etc.)
      },
    });
  }

  // Ensure user membership
  const member = await prisma.userOrg.findFirst({
    where: { userId: session.user.id, orgId: org.id },
  });
  if (!member) {
    await prisma.userOrg.create({
      data: {
        userId: session.user.id,
        orgId: org.id,
        role: "ADMIN", // demo convenience; tighten later if you want
      },
    });
  }

  return org.id;
}

/** Cached org id helper for legacy callers */
export async function getDemoOrgId(): Promise<string> {
  if (cachedDemoOrgId) return cachedDemoOrgId;
  cachedDemoOrgId = await getOrCreateDemoOrgId();
  return cachedDemoOrgId;
}

/** Enter demo: set cookies (org + demo flag) */
export async function enterDemo(orgId: string) {
  const jar = cookies();
  const now = Date.now();
  const last = Number(jar.get(LAST_ENTER_COOKIE)?.value || 0);
  if (now - last < 10_000) return; // 10s quiet period

  jar.set(ORG_COOKIE_NAME, orgId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: true,
    maxAge: 60 * 60 * 6, // 6h demo window
  });
  jar.set(DEMO_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: true,
    maxAge: 60 * 60 * 6,
  });
  jar.set(LAST_ENTER_COOKIE, String(now), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: true,
    maxAge: 60 * 60 * 6,
  });
}

/** Leave demo: clear demo flag; keep org cookie logic simple (optional: restore last real org) */
export async function leaveDemo() {
  const jar = cookies();
  jar.delete(DEMO_COOKIE);
  // You can also clear org cookie to force reselect:
  // jar.delete(ORG_COOKIE_NAME);
}

export function isDemoModeFromCookies(): boolean {
  const val = cookies().get(DEMO_COOKIE)?.value;
  return val === "1";
}

export const DEMO_COOKIE_NAME = DEMO_COOKIE;

/** Legacy helper: determine demo from cookie */
export async function isDemoSession(_session: Session | null | undefined) {
  return isDemoModeFromCookies();
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

