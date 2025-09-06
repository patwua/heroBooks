/* eslint-disable no-console */
import { prisma } from "@/lib/prisma";
import { getDemoOrgId } from "@/lib/demo";
import { VAT_CODES, SEED_CUSTOMERS, SEED_VENDORS, SEED_ITEMS, SEED_DOCS } from "@/lib/seed/demo-data";
import { Decimal } from "@prisma/client/runtime/library";

async function upsertDemoOrg(): Promise<string> {
  // getDemoOrgId resolves or creates the demo org (by name or id)
  const orgId = await getDemoOrgId();
  const org = await prisma.org.findUnique({ where: { id: orgId } });
  if (!org) throw new Error("Demo org resolution failed");
  console.log(`Demo Org: ${org.name} (${org.id})`);
  return orgId;
}

async function seedVat(orgId: string) {
  for (const v of VAT_CODES) {
    const existing = await prisma.taxCode.findFirst({ where: { orgId, name: v.name } });
    if (existing) {
      if (existing.rate !== v.rate) {
        await prisma.taxCode.update({ where: { id: existing.id }, data: { rate: v.rate } });
      }
      continue;
    }
    await prisma.taxCode.create({ data: { orgId, name: v.name, rate: v.rate } });
  }
  console.log("✓ VAT codes");
}

async function seedCustomers(orgId: string) {
  for (const c of SEED_CUSTOMERS) {
    const found = await prisma.customer.findFirst({ where: { orgId, name: c.name } });
    if (found) {
      // keep email fresh if changed
      if (c.email && c.email !== found.email) {
        await prisma.customer.update({ where: { id: found.id }, data: { email: c.email } });
      }
      continue;
    }
    await prisma.customer.create({
      data: { orgId, name: c.name, email: c.email ?? null },
    });
  }
  console.log("✓ Customers");
}

async function seedVendors(orgId: string) {
  for (const v of SEED_VENDORS) {
    // You have @@unique([orgId, name]) on Vendor, so we can upsert by that
    await prisma.vendor.upsert({
      where: { orgId_name: { orgId, name: v.name } },
      create: { orgId, name: v.name, email: v.email ?? null },
      update: { email: v.email ?? null },
    });
  }
  console.log("✓ Vendors");
}

async function seedItems(orgId: string) {
  // Build tax index by name
  const taxes = await prisma.taxCode.findMany({ where: { orgId } });
  const taxByName = new Map(taxes.map((t) => [t.name, t]));

  for (const it of SEED_ITEMS) {
    const tax = taxByName.get(it.tax);
    const found = await prisma.item.findFirst({ where: { orgId, name: it.name } });
    if (found) {
      await prisma.item.update({
        where: { id: found.id },
        data: { price: it.price, taxCodeId: tax?.id },
      });
      continue;
    }
    await prisma.item.create({
      data: { orgId, name: it.name, price: it.price, taxCodeId: tax?.id ?? null },
    });
  }
  console.log("✓ Items");
}

async function seedInvoices(orgId: string) {
  // Build indices
  const customers = await prisma.customer.findMany({ where: { orgId } });
  const items = await prisma.item.findMany({ where: { orgId } });
  const taxes = await prisma.taxCode.findMany({ where: { orgId } });
  const custByName = new Map(customers.map((c) => [c.name, c]));
  const itemByName = new Map(items.map((i) => [i.name, i]));
  const taxById = new Map(taxes.map((t) => [t.id, t]));
  const taxByName = new Map(taxes.map((t) => [t.name, t]));

  for (const inv of SEED_DOCS.invoices) {
    const customer = custByName.get(inv.customer);
    if (!customer) {
      console.warn(`Skip invoice ${inv.number}: customer ${inv.customer} not found`);
      continue;
    }

    const exists = await prisma.invoice.findUnique({
      where: { orgId_number: { orgId, number: inv.number } },
    });

    const linesCreate = inv.lines.map((l) => {
      const item = itemByName.get(l.item);
      if (!item) throw new Error(`Item not found: ${l.item}`);
      const qty = l.qty ?? 1;
      const unitPrice = item.price as Decimal;
      // prefer item.taxCodeId if set; else fall back to VAT14 by name
      const taxId = item.taxCodeId ?? taxByName.get("VAT Standard 14%")?.id ?? null;

      return {
        orgId,
        itemId: item.id,
        quantity: qty,
        unitPrice: unitPrice,
        taxCodeId: taxId,
        description: item.name,
      };
    });

    if (!exists) {
      await prisma.invoice.create({
        data: {
          orgId,
          number: inv.number,
          customerId: customer.id,
          issueDate: new Date(inv.issueDate),
          dueDate: inv.dueDate ? new Date(inv.dueDate) : null,
          status: inv.status ?? "draft",
          isDemo: false,
          lines: { create: linesCreate as any },
        },
      });
    } else {
      await prisma.invoice.update({
        where: { id: exists.id },
        data: {
          customerId: customer.id,
          issueDate: new Date(inv.issueDate),
          dueDate: inv.dueDate ? new Date(inv.dueDate) : null,
          status: inv.status ?? exists.status,
        },
      });

      // Ensure lines exist (simple approach: if none exist, create; else leave as-is)
      const count = await prisma.invoiceLine.count({ where: { orgId, invoiceId: exists.id } });
      if (count === 0) {
        await prisma.invoice.update({
          where: { id: exists.id },
          data: { lines: { create: linesCreate as any } },
        });
      }
    }

    // Partial payment
    if (inv.partialPayment && inv.partialPayment.gt(0)) {
      const invoiceRecord = await prisma.invoice.findUnique({
        where: { orgId_number: { orgId, number: inv.number } },
        select: { id: true },
      });
      if (!invoiceRecord) continue;

      const existingPayment = await prisma.payment.findFirst({
        where: { orgId, receiptNumber: 5001 },
      });
      if (existingPayment) {
        await prisma.payment.update({
          where: { id: existingPayment.id },
          data: { amount: inv.partialPayment, method: "Bank Transfer" },
        });
      } else {
        await prisma.payment.create({
          data: {
            orgId,
            invoiceId: invoiceRecord.id,
            amount: inv.partialPayment,
            method: "Bank Transfer",
            receiptNumber: 5001,
            date: new Date(inv.issueDate),
            isDemo: false,
          },
        });
      }
    }
  }
  console.log("✓ Invoices (+lines) and demo Payment(s)");
}

async function seedEstimates(orgId: string) {
  const customers = await prisma.customer.findMany({ where: { orgId } });
  const items = await prisma.item.findMany({ where: { orgId } });
  const taxes = await prisma.taxCode.findMany({ where: { orgId } });
  const custByName = new Map(customers.map((c) => [c.name, c]));
  const itemByName = new Map(items.map((i) => [i.name, i]));
  const taxByName = new Map(taxes.map((t) => [t.name, t]));

  for (const est of SEED_DOCS.estimates) {
    const customer = custByName.get(est.customer);
    if (!customer) {
      console.warn(`Skip estimate ${est.number}: customer ${est.customer} not found`);
      continue;
    }

    const exists = await prisma.estimate.findUnique({
      where: { orgId_number: { orgId, number: est.number } },
    });

    const linesCreate = est.lines.map((l) => {
      const item = itemByName.get(l.item);
      if (!item) throw new Error(`Item not found: ${l.item}`);
      const qty = l.qty ?? 1;
      const unitPrice = item.price as Decimal;
      const taxId = item.taxCodeId ?? taxByName.get("VAT Standard 14%")?.id ?? null;
      return {
        orgId,
        quantity: qty,
        unitPrice,
        taxCodeId: taxId,
        description: item.name,
      };
    });

    if (!exists) {
      // Your Estimate requires subTotal, vatTotal, total. We’ll compute simple sums.
      const subTotal = linesCreate.reduce(
        (acc, l) => acc.plus(l.unitPrice.mul(l.quantity)),
        new Decimal(0)
      );
      const vatTotal = new Decimal(
        linesCreate
          .map((l) => {
            // rough VAT calc: if tax is 14% name, apply 14%, else 0
            // for precision you'd join TaxCode.rate, but we already have taxId only.
            // To be precise, fetch rate now:
            return l;
          })
          .reduce((acc, _l) => acc, 0)
      );
      // Recompute exactly with rates:
      const taxCodes = await prisma.taxCode.findMany({ where: { orgId } });
      const taxById = new Map(taxCodes.map((t) => [t.id, t.rate]));
      const vatExact = linesCreate.reduce((acc, l) => {
        const rate = l.taxCodeId ? taxById.get(l.taxCodeId) ?? 0 : 0;
        const lineNet = (l.unitPrice as Decimal).mul(l.quantity);
        return acc.plus(lineNet.mul(rate));
      }, new Decimal(0));
      const total = subTotal.plus(vatExact);

      await prisma.estimate.create({
        data: {
          orgId,
          number: est.number,
          customerId: customer.id,
          issueDate: new Date(est.issueDate),
          expiryDate: est.expiryDate ? new Date(est.expiryDate) : null,
          status: est.status ?? "draft",
          subTotal,
          vatTotal: vatExact,
          total,
          isDemo: false,
          lines: { create: linesCreate as any },
        },
      });
    } else {
      await prisma.estimate.update({
        where: { id: exists.id },
        data: {
          customerId: customer.id,
          issueDate: new Date(est.issueDate),
          expiryDate: est.expiryDate ? new Date(est.expiryDate) : null,
          status: est.status ?? exists.status,
        },
      });
    }
  }
  console.log("✓ Estimates (+lines)");
}

async function seedBank(orgId: string) {
  // We’ll use a single demo bank/account pair on all rows for now
  const bankName = "Demo Bank";
  const accountNo = "000111222";

  for (const bt of SEED_DOCS.bank) {
    // simple CREDIT/DEBIT by amount sign
    const type = bt.amount.greaterThan(0) ? "CREDIT" : "DEBIT";

    await prisma.bankTransaction.upsert({
      where: {
        // No unique on ref; use (orgId, date, amount, memo?) pattern to keep idempotent-ish
        // If you later add a unique ref per org, switch to that.
        // Here we fake uniqueness by memo signature.
        id: (
          await prisma.bankTransaction.findFirst({
            where: {
              orgId,
              date: new Date(bt.date),
              amount: bt.amount,
              memo: bt.description,
            },
            select: { id: true },
          })
        )?.id ?? "NOT-FOUND",
      },
      create: {
        orgId,
        bankName,
        accountNo,
        date: new Date(bt.date),
        amount: bt.amount,
        type,
        memo: bt.description,
        status: "UNMATCHED",
        isDemo: false,
      },
      update: {
        bankName,
        accountNo,
        type,
        memo: bt.description,
      },
    }).catch(async () => {
      // If update failed because NOT-FOUND id, just create
      await prisma.bankTransaction.create({
        data: {
          orgId,
          bankName,
          accountNo,
          date: new Date(bt.date),
          amount: bt.amount,
          type,
          memo: bt.description,
          status: "UNMATCHED",
          isDemo: false,
        },
      });
    });
  }
  console.log("✓ Bank transactions");
}

async function main() {
  const orgId = await upsertDemoOrg();
  await seedVat(orgId);
  await seedCustomers(orgId);
  await seedVendors(orgId);
  await seedItems(orgId);
  await seedInvoices(orgId);
  await seedEstimates(orgId);
  await seedBank(orgId);
  console.log("Demo seed complete ✅");
}

main()
  .catch((e) => {
    console.error("Seed failed ❌", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

