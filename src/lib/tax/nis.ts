import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function computeNIS(orgId: string, date: Date, grossMonthly: Decimal) {
  const setting = await prisma.nisSetting.findFirst({
    where: {
      orgId,
      effectiveFrom: { lte: date },
      OR: [{ effectiveTo: null }, { effectiveTo: { gte: date } }],
    },
    orderBy: { effectiveFrom: "desc" },
  });
  if (!setting) return { employee: new Decimal(0), employer: new Decimal(0), insurable: new Decimal(0) };

  const ceiling = setting.ceilingAmount ? new Decimal(setting.ceilingAmount.toString()) : null;
  const insurable = ceiling ? Decimal.min(grossMonthly, ceiling) : grossMonthly;
  const employee = insurable.mul(new Decimal(setting.employeeRate.toString()));
  const employer = insurable.mul(new Decimal(setting.employerRate.toString()));
  return { employee, employer, insurable };
}

