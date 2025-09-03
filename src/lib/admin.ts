import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";

export type AdminGate =
  | { ok: true; user: Session["user"]; orgId: string; reason: null }
  | { ok: false; reason: "unauthorized" | "forbidden" };

export async function requireAdmin(): Promise<AdminGate> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, reason: "unauthorized" };

  const userId = (session.user as any).id as string;
  const membership = await prisma.userOrg.findFirst({
    where: { userId, role: { in: ["OWNER", "ADMIN"] } },
    select: { orgId: true, user: { select: { id: true, email: true } } },
  });
  if (!membership) return { ok: false, reason: "forbidden" };

  return { ok: true, user: membership.user, orgId: membership.orgId, reason: null };
}
