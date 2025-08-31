import { prisma } from "@/lib/prisma";

export interface VatLineInput {
  quantity: number;
  unitPrice: number;
  taxRate?: number;
}

export interface VatLineResult extends VatLineInput {
  subTotal: number;
  vat: number;
  total: number;
}

export function calcLines(lines: VatLineInput[]) {
  const detailed = lines.map((l) => {
    const subTotal = l.quantity * l.unitPrice;
    const vat = subTotal * (l.taxRate ?? 0);
    const total = subTotal + vat;
    return { ...l, subTotal, vat, total };
  });
  const subTotal = detailed.reduce((a, b) => a + b.subTotal, 0);
  const vatTotal = detailed.reduce((a, b) => a + b.vat, 0);
  const total = detailed.reduce((a, b) => a + b.total, 0);
  return { lines: detailed, subTotal, vatTotal, total };
}

export async function nextDocNumber(prefix: string, model: "estimate" | "invoice" = "estimate") {
  const year = new Date().getFullYear();
  const base = `${prefix}-${year}`;
  const last = await (prisma as any)[model].findFirst({
    where: { number: { startsWith: base } },
    orderBy: { number: "desc" },
    select: { number: true }
  });
  const lastSeq = last?.number ? parseInt(String(last.number).split("-")[2] ?? "0") : 0;
  const next = lastSeq + 1;
  return `${base}-${next.toString().padStart(4, "0")}`;
}
