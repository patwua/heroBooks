import { test, expect } from '@playwright/test';
import { prisma } from '../src/lib/prisma';
import { hash } from 'bcryptjs';

const EMAIL = 'test@example.com';
const PASSWORD = 'password';

async function seed() {
  await prisma.billLine.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.userOrg.deleteMany();
  await prisma.org.deleteMany();
  await prisma.user.deleteMany();

  const org = await prisma.org.create({ data: { name: 'Test Org' } });
  await prisma.user.create({
    data: {
      email: EMAIL,
      password: await hash(PASSWORD, 10),
      orgs: { create: { orgId: org.id } },
    },
  });

  await prisma.vendor.create({ data: { orgId: org.id, name: 'Seed Vendor' } });
}

test.beforeEach(async () => {
  await seed();
});

test('submit bill and list totals', async ({ page }) => {
  await page.goto('/sign-in');
  await page.fill('input[placeholder="Email"]', EMAIL);
  await page.fill('input[placeholder="Password"]', PASSWORD);
  await page.click('button:has-text("Continue")');
  await page.waitForURL('**/app/dashboard');

  await page.goto('/purchases/bills');
  await page.click('select');
  await expect(page.locator('select')).toContainText('Seed Vendor');

  await page.selectOption('select', { label: 'Seed Vendor' });
  await page.fill('input[placeholder="Description"]', 'Consulting');
  await page.fill('input[placeholder="Amount"]', '100');
  await page.click('button:has-text("Add Bill")');

  const row = page.locator('tbody tr').first();
  await expect(row.locator('td').nth(0)).toHaveText('Seed Vendor');
  await expect(row.locator('td').nth(1)).toHaveText('$100.00');
  await expect(row.locator('td').nth(2)).toHaveText('$0.00');
});
