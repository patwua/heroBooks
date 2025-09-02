import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { prisma } from "./prisma";

const ORG_COOKIE = "hb_org";

/**
 * Read active orgId from cookie and validate membership against session.
 * Throws on invalid access.
 */
export async function getActiveOrgId(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");

  const jar = cookies();
  const cookieOrg = jar.get(ORG_COOKIE)?.value;

  if (!cookieOrg) {
    // pick the user's default org if any
    const first = await prisma.userOrg.findFirst({
      where: { userId: session.user.id },
      select: { orgId: true },
      orderBy: { createdAt: "asc" },
    });
    if (!first) throw new Error("No organization membership found");
    return first.orgId;
  }

  // validate membership
  const member = await prisma.userOrg.findFirst({
    where: { userId: session.user.id, orgId: cookieOrg },
    select: { orgId: true },
  });

  if (!member) {
    throw new Error("Invalid org selection");
  }

  return cookieOrg;
}

/** List orgs current user belongs to */
export async function listUserOrgs() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];
  return prisma.userOrg.findMany({
    where: { userId: session.user.id },
    include: { org: { select: { id: true, name: true, logoUrl: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export const ORG_COOKIE_NAME = ORG_COOKIE;
