import { PaymentProvider, CreateCheckoutInput, CreateCheckoutResult } from "./types";
import { createHmac, timingSafeEqual } from "crypto";

// MMG (QR / hosted) — stub; adjust with real docs
const MMG_BASE = process.env.MMG_BASE_URL ?? "https://uat-developer.mmg.gy";
const MMG_MERCHANT_ID = process.env.MMG_MERCHANT_ID ?? "";
const MMG_API_KEY = process.env.MMG_API_KEY ?? "";
const MMG_CHECKOUT_PATH = process.env.MMG_CHECKOUT_PATH ?? "/api/checkout";

async function postJSON(url: string, body: any, headers: Record<string, string> = {}) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`MMG HTTP ${res.status}`);
  return res.json();
}

export const mmgProvider: PaymentProvider = {
  async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
    try {
      const payload = {
        merchantId: MMG_MERCHANT_ID,
        amount: input.amountGYD,
        currency: "GYD",
        description: input.description,
        returnUrl: input.returnUrl,
        reference: input.intentId, // our internal key
        mode: "QR", // hint; depends on MMG API
      };
      const data = await postJSON(`${MMG_BASE}${MMG_CHECKOUT_PATH}`, payload, { Authorization: `Bearer ${MMG_API_KEY}` });

      const redirectUrl: string = data?.checkoutUrl ?? data?.qrUrl ?? "";
      const externalRef: string | undefined = data?.transactionId ?? data?.reference;
      if (!redirectUrl) return { ok: false, error: "No MMG checkout URL" };
      return { ok: true, redirectUrl, externalRef };
    } catch (e: any) {
      return { ok: false, error: e.message ?? "MMG createCheckout failed" };
    }
  },
  async verifyAndParseWebhook(req: Request, rawBody: string) {
    try {
      const signature = req.headers.get("x-mmg-signature") ?? "";
      const secret = process.env.MMG_WEBHOOK_SECRET ?? "";

      if (!signature || !secret) return { ok: false };

      const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
      const sigBuf = Buffer.from(signature, "hex");
      const expBuf = Buffer.from(expected, "hex");

      if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
        return { ok: false };
      }

      const body = JSON.parse(rawBody || "{}");
      const statusMap: Record<string, "paid" | "failed" | "cancelled" | "pending"> = {
        SUCCESS: "paid",
        FAILED: "failed",
        CANCELLED: "cancelled",
        PENDING: "pending",
      };
      return {
        ok: true,
        externalRef: body?.transactionId ?? body?.reference,
        intentId: body?.reference,
        amountGYD: Number(body?.amount) || undefined,
        status: statusMap[(body?.status ?? "").toUpperCase()] ?? "pending",
      };
    } catch (e: any) {
      return { ok: false, error: e.message ?? "MMG webhook parse error" };
    }
  },
};
