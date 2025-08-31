import { prisma } from "@/lib/prisma";

export async function notifyWebhook(orgId: string, event: string, payload: any) {
  const settings = await prisma.orgSettings.findUnique({ where: { orgId } });
  if (!settings?.webhookUrl) return;
  try {
    await fetch(settings.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, data: payload })
    });
  } catch (err) {
    console.error("Webhook error", err);
  }
}
