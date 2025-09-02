import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { ok: false, reason: "unauthorized" } as const;
  }
  const userId = (session.user as any).id as string;
  const membership = await prisma.userOrg.findFirst({
    where: { userId, role: { in: ["OWNER", "ADMIN"] } },
    select: { orgId: true, user: { select: { id: true, email: true } } },
  });
  if (!membership) {
    return { ok: false, reason: "forbidden" } as const;
  }
  return { ok: true, user: membership.user, orgId: membership.orgId } as const;
}
