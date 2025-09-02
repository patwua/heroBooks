import { PaymentProvider, CreateCheckoutInput, CreateCheckoutResult } from "./types";

export const bankProvider: PaymentProvider = {
  async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
    return { ok: true, redirectUrl: `/checkout/bank?intent=${encodeURIComponent(input.intentId)}` };
  },
};
