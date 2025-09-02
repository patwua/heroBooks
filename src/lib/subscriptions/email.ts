import { prisma } from "@/lib/prisma";
// If you already have a mailer util, import it here and replace the console.log.
export async function sendReceiptEmail(intentId: string): Promise<boolean> {
  try {
    const intent = await prisma.checkoutIntent.findUnique({
      where: { id: intentId },
      include: { user: { select: { email: true, name: true } } },
    });
    if (!intent?.user?.email) return false;

    // Replace with your mailer implementation
    console.log("[mailer] Sending receipt", {
      to: intent.user.email,
      subject: `Receipt — heroBooks ${intent.plan} plan`,
      body: `We received your payment of GYD $${intent.amount.toLocaleString()}. Thanks! Reference: ${intent.externalRef ?? intent.id}`,
    });

    return true;
  } catch (err) {
    console.error("[mailer] Failed to send receipt", err);
    return false;
  }
}
