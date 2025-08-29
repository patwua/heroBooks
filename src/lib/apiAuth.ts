import { prisma } from "@/lib/prisma";

export async function orgFromApiKey(apiKey: string | null) {
  if (!apiKey) return null;
  const settings = await prisma.orgSettings.findUnique({
    where: { apiKey },
    include: { org: true }
  });
  return settings?.org || null;
}
