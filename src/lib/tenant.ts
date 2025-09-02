import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { prisma } from "./prisma";
import type { Org, OrgTheme, UserOrg } from "@prisma/client";

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
      orderBy: { orgId: "asc" },
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
type OrgWithTheme = Pick<Org, "id" | "name"> & {
  theme: Pick<OrgTheme, "logoUrl"> | null;
};

type UserOrgWithOrg = UserOrg & {
  org: OrgWithTheme;
};

export async function listUserOrgs(): Promise<UserOrgWithOrg[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];
  return prisma.userOrg.findMany({
    where: { userId: session.user.id },
    include: { org: { select: { id: true, name: true, theme: { select: { logoUrl: true } } } } },
    orderBy: { orgId: "asc" },
  });
}

export const ORG_COOKIE_NAME = ORG_COOKIE;
