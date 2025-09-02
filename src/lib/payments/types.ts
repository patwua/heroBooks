export type PaymentMethod = "paypal" | "zelle" | "mmg" | "bank";

export type CreateCheckoutInput = {
  intentId: string;
  amountGYD: number;     // integer dollars (GYD)
  description: string;
  returnUrl: string;     // browser return
  metadata?: Record<string, string | number>;
};

export type CreateCheckoutResult =
  | { ok: true; redirectUrl: string; externalRef?: string }
  | { ok: false; error: string };

export interface PaymentProvider {
  createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult>;
  verifyAndParseWebhook?(req: Request, rawBody: string): Promise<{
    ok: boolean;
    externalRef?: string;
    intentId?: string;
    amountGYD?: number;
    status?: "paid" | "failed" | "cancelled" | "pending";
    error?: string;
  }>;
}
