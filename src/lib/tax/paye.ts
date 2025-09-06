import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function computePAYE(orgId: string, date: Date, grossMonthly: Decimal) {
  const allowance = Decimal.max(new Decimal(130000), grossMonthly.div(3));
  const chargeable = Decimal.max(new Decimal(0), grossMonthly.sub(allowance));

  const brackets = await prisma.payeBracket.findMany({
    where: {
      orgId,
      effectiveFrom: { lte: date },
      OR: [{ effectiveTo: null }, { effectiveTo: { gte: date } }],
    },
    orderBy: { order: "asc" },
  });

  let remaining = chargeable;
  let tax = new Decimal(0);
  for (const b of brackets) {
    const cap = b.upTo ? new Decimal(b.upTo.toString()) : null;
    const take = cap ? Decimal.min(remaining, cap) : remaining;
    if (take.lte(0)) break;
    tax = tax.add(take.mul(new Decimal(b.rate.toString())));
    remaining = remaining.sub(take);
    if (remaining.lte(0)) break;
  }
  return { allowance, chargeable, tax };
}

