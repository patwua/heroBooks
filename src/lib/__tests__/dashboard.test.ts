import assert from "node:assert/strict";
import test from "node:test";
import { getDashboardDataForOrg } from "../dashboard";
import { prisma } from "@/lib/prisma";

const DAY = 1000 * 60 * 60 * 24;

test("aggregates dashboard metrics", async () => {
  const originalInvoice = prisma.invoice;
  const originalBill = prisma.bill;
  const realNow = Date.now;

  Date.now = () => new Date("2024-02-01T00:00:00Z").getTime();

  (prisma as any).invoice = {
    findMany: async () => [
      {
        dueDate: new Date(Date.now() - 10 * DAY),
        issueDate: new Date(Date.now() - 31 * DAY),
        lines: [
          { quantity: 1, unitPrice: 100, taxCode: { rate: 0.2 } },
        ],
        payments: [{ amount: 20 }],
      },
      {
        dueDate: new Date(Date.now() - 40 * DAY),
        issueDate: new Date(Date.now() - 60 * DAY),
        lines: [
          { quantity: 2, unitPrice: 100, taxCode: null },
        ],
        payments: [],
      },
    ],
  };

  (prisma as any).bill = {
    findMany: async () => [
      {
        dueDate: new Date(Date.now() - 5 * DAY),
        billDate: new Date(Date.now() - 20 * DAY),
        lines: [
          { quantity: 1, unitCost: 50, taxCode: { rate: 0.1 } },
        ],
        bankTransactions: [],
      },
      {
        dueDate: new Date(Date.now() - 75 * DAY),
        billDate: new Date(Date.now() - 90 * DAY),
        lines: [
          { quantity: 1, unitCost: 100, taxCode: null },
        ],
        bankTransactions: [{ amount: 30 }],
      },
    ],
  };

  const data = await getDashboardDataForOrg("org1");

  assert.equal(data.arTotal, 300);
  assert.equal(data.apTotal, 125);
  assert.equal(data.vatDue, 15);
  assert.deepEqual(data.arAging.map((b) => b.amount), [0, 100, 200, 0, 0]);
  assert.deepEqual(data.apAging.map((b) => b.amount), [0, 55, 0, 70, 0]);

  (prisma as any).invoice = originalInvoice;
  (prisma as any).bill = originalBill;
  Date.now = realNow;
});
