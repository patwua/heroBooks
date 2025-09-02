import { PaymentProvider, CreateCheckoutInput, CreateCheckoutResult } from "./types";

const PAYPAL_BASE =
  process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;

// Simple access token helper
async function getToken() {
  const creds = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${creds}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal token HTTP ${res.status}`);
  return res.json() as Promise<{ access_token: string }>;
}

export const paypalProvider: PaymentProvider = {
  async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
    try {
      // PayPal orders are in a PayPal currency; show GYD on site, but we’ll charge USD here (common practice).
      // If you need strict GYD, keep it manual via Zelle/MMG/Bank.
      const chargeUSD = Math.ceil((input.amountGYD / (Number(process.env.PAYPAL_GYD_PER_USD) || 200)) * 100) / 100;

      const { access_token } = await getToken();
      const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
        method: "POST",
        headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: input.intentId,
              description: input.description,
              amount: { currency_code: "USD", value: chargeUSD.toFixed(2) },
            },
          ],
          application_context: {
            return_url: `${process.env.NEXTAUTH_URL}/api/paypal/capture?intent=${encodeURIComponent(
              input.intentId
            )}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/checkout?cancel=1`,
            brand_name: "heroBooks",
            user_action: "PAY_NOW",
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "PayPal order create failed");

      const approval = (data.links || []).find((l: any) => l.rel === "approve")?.href;
      const orderId = data.id as string | undefined;
      if (!approval || !orderId) return { ok: false, error: "No PayPal approval link" };
      return { ok: true, redirectUrl: approval, externalRef: orderId };
    } catch (e: any) {
      return { ok: false, error: e.message ?? "PayPal createCheckout failed" };
    }
  },
};
