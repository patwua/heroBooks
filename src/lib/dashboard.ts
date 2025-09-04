import { prisma } from "@/lib/prisma";
import { getActiveOrgId } from "@/lib/tenant";

export interface AgingBucket {
  label: string;
  amount: number;
}

export interface DashboardData {
  arTotal: number;
  apTotal: number;
  vatDue: number;
  arAging: AgingBucket[];
  apAging: AgingBucket[];
}

const LABELS = ["Current", "1–30d", "31–60d", "61–90d", "90d+"];

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function bucketIndex(daysPastDue: number): number {
  if (daysPastDue <= 0) return 0; // current or not yet due
  if (daysPastDue <= 30) return 1;
  if (daysPastDue <= 60) return 2;
  if (daysPastDue <= 90) return 3;
  return 4;
}

export async function getDashboardDataForOrg(orgId: string): Promise<DashboardData> {
  const [invoices, bills] = await Promise.all([
    prisma.invoice.findMany({
      where: { orgId, status: { not: "paid" } },
      include: { lines: { include: { taxCode: true } }, payments: true },
    }),
    prisma.bill.findMany({
      where: { orgId },
      include: { lines: { include: { taxCode: true } }, bankTransactions: true },
    }),
  ]);

  const arBuckets = [0, 0, 0, 0, 0];
  const apBuckets = [0, 0, 0, 0, 0];
  let arTotal = 0;
  let apTotal = 0;
  let outputVat = 0;
  let inputVat = 0;
  const now = Date.now();

  for (const inv of invoices) {
    let base = 0;
    let vat = 0;
    for (const line of inv.lines) {
      const lineBase = Number(line.unitPrice) * line.quantity;
      base += lineBase;
      if (line.taxCode) vat += lineBase * line.taxCode.rate;
    }
    outputVat += vat;
    const total = base + vat;
    const paid = inv.payments.reduce((s, p) => s + Number(p.amount), 0);
    const outstanding = total - paid;
    arTotal += outstanding;
    const due = (inv.dueDate || inv.issueDate).getTime();
    const days = Math.floor((now - due) / MS_PER_DAY);
    arBuckets[bucketIndex(days)] += outstanding;
  }

  for (const bill of bills) {
    let base = 0;
    let vat = 0;
    for (const line of bill.lines) {
      const lineBase = Number(line.unitCost) * line.quantity;
      base += lineBase;
      if (line.taxCode) vat += lineBase * line.taxCode.rate;
    }
    inputVat += vat;
    const total = base + vat;
    const paid = bill.bankTransactions.reduce((s, tx) => s + Number(tx.amount), 0);
    const outstanding = total - paid;
    apTotal += outstanding;
    const due = (bill.dueDate || bill.billDate).getTime();
    const days = Math.floor((now - due) / MS_PER_DAY);
    apBuckets[bucketIndex(days)] += outstanding;
  }

  const arAging = LABELS.map((label, i) => ({ label, amount: arBuckets[i] }));
  const apAging = LABELS.map((label, i) => ({ label, amount: apBuckets[i] }));
  const vatDue = outputVat - inputVat;

  return { arTotal, apTotal, vatDue, arAging, apAging };
}

export async function getDashboardData(): Promise<DashboardData> {
  const orgId = await getActiveOrgId();
  return getDashboardDataForOrg(orgId);
}
