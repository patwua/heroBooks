import { PaymentProvider } from "./types";
import { paypalProvider } from "./paypal";
import { zelleProvider } from "./zelle";
import { mmgProvider } from "./mmg";
import { bankProvider } from "./bank";

export const providers: Record<string, PaymentProvider> = {
  paypal: paypalProvider,
  zelle: zelleProvider,
  mmg: mmgProvider,
  bank: bankProvider,
};

export function getProviderOrThrow(name: string): PaymentProvider {
  const p = providers[name];
  if (!p) throw new Error(`Unknown payment provider: ${name}`);
  return p;
}
