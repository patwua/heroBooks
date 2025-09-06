import { Decimal } from "@prisma/client/runtime/library";

export function calcLineVat(unitPrice: Decimal, qty: number, rate: number | string | Decimal | null | undefined) {
  const r = rate ? new Decimal(rate as any) : new Decimal(0);
  return unitPrice.mul(qty).mul(r);
}
