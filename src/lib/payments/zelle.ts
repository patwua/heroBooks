import { PaymentProvider, CreateCheckoutInput, CreateCheckoutResult } from "./types";

/**
 * Zelle has no public checkout API — treat like a guided bank transfer:
 * show your Zelle handle (email/phone) and the reference code (intentId).
 * You’ll confirm manually when received.
 */
export const zelleProvider: PaymentProvider = {
  async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
    return { ok: true, redirectUrl: `/checkout/zelle?intent=${encodeURIComponent(input.intentId)}` };
  },
};
