import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  webServer: {
    command: 'bash -c "pnpm prisma db push && pnpm dev"',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      DATABASE_URL: 'file:./tests/test.db',
      NEXTAUTH_SECRET: 'test-secret',
    },
  },
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
});
